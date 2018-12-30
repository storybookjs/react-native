/* eslint no-underscore-dangle: 0 */
import { history, document } from 'global';
import EventEmitter from 'eventemitter3';
import qs from 'qs';
import mergeWith from 'lodash.mergewith';
import isEqual from 'lodash.isequal';
import Events from '@storybook/core-events';
import debounce from 'lodash.debounce';
import toId, { sanitize } from './id';

// TODO: these are copies from components/nav/lib
// refactor to DRY

const toKey = input =>
  input.replace(/[^a-z0-9]+([a-z0-9])/gi, (...params) => params[1].toUpperCase());

const toGroup = name => ({
  name,
  children: [],
  id: toKey(name),
});
const toChild = it => ({ ...it });

// merge with concatenating arrays, but no duplicates
const merge = (a, b) =>
  mergeWith(a, b, (objValue, srcValue) => {
    if (Array.isArray(srcValue) && Array.isArray(objValue)) {
      srcValue.forEach(s => {
        const existing = objValue.find(o => o === s || isEqual(o, s));
        if (!existing) {
          objValue.push(s);
        }
      });

      return objValue;
    }
    if (Array.isArray(objValue)) {
      // eslint-disable-next-line no-console
      console.log('the types mismatch, picking', objValue);
      return objValue;
    }
    return undefined;
  });

export const splitPath = (path, { rootSeparator, groupSeparator }) => {
  const [root, remainder] = path.split(rootSeparator, 2);
  const groups = (remainder || path).split(groupSeparator).filter(i => !!i);

  // when there's no remainder, it means the root wasn't found/split
  return {
    root: remainder ? root : null,
    groups,
  };
};

let count = 0;

function getId() {
  count += 1;
  return count;
}

const toExtracted = obj =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'function') {
      return acc;
    }
    if (Array.isArray(value)) {
      return Object.assign(acc, { [key]: value.slice().sort() });
    }
    return Object.assign(acc, { [key]: value });
  }, {});

export default class StoryStore extends EventEmitter {
  constructor({ channel }) {
    super();

    this._legacydata = {};
    this._data = {};
    this._revision = 0;
    this._selection = {};
    this._channel = channel;

    if (!channel) {
      throw new Error('channel is required');
    }

    this.on(Events.STORY_INIT, () => {
      this.setSelection(this.fromId(this.getIdOnPath()));
    });
  }

  // NEW apis

  getIdOnPath = () => {
    const { id } = qs.parse(document.location.search, { ignoreQueryPrefix: true });
    return id;
  };

  setPath = input => {
    history.replaceState({}, '', `${document.location.pathname}?id=${input}`);
  };

  fromId = id => {
    try {
      const data = this._data[id];

      if (!data || !data.getDecorated) {
        return null;
      }

      return {
        ...data,
        story: p => data.getDecorated()({ ...data, parameters: { ...data.parameters, ...p } }),
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('failed to get story:', this._data);
      // eslint-disable-next-line no-console
      console.error(e);
      return {};
    }
  };

  setSeparators(data) {
    this.separators = data;
  }

  raw() {
    return Object.values(this._data)
      .filter(i => !!i.getDecorated)
      .map(({ id }) => this.fromId(id));
  }

  extract() {
    // removes function values from all stories so they are safe to transport over the channel
    return Object.entries(this._data).reduce(
      (a, [k, v]) => Object.assign(a, { [k]: toExtracted(v) }),
      {}
    );
  }

  setSelection = data => {
    this._selection = data;
    setTimeout(() => this.emit(Events.STORY_RENDER), 1);
  };

  getSelection = () => this._selection;

  addStory(
    { kind, name: storyName, story, getDecorated, parameters = {} },
    { rootSeparator, groupSeparator }
  ) {
    const { _data } = this;
    const { root, groups } = splitPath(kind, { rootSeparator, groupSeparator });

    const rootAndGroups = []
      .concat(root || [])
      .concat(groups)
      .map(toGroup)
      // Map a bunch of extra fields onto the groups, collecting the path as we go (thus the reduce)
      .reduce((soFar, group, index, original) => {
        const { name } = group;
        const parent = index > 0 && soFar[index - 1].path;
        const path = sanitize(parent ? `${parent}-${name}` : name);
        return soFar.concat([
          {
            ...group,
            path,
            parent,
            depth: index,
            isComponent: index === original.length - 1,
            isRoot: index === 0,
          },
        ]);
      }, []);

    const storyId = toId(kind, storyName);
    const paths = [...rootAndGroups.map(g => g.path), storyId];

    // Ok, now let's add everything to the store
    rootAndGroups.forEach((group, index) => {
      const child = paths[index + 1];
      const { path } = group;
      _data[path] = merge(_data[path] || {}, {
        ...group,
        ...(child && { children: [child] }),
      });
    });

    // Check that we don't already have this item in the story
    if (_data[storyId]) {
      // TODO -- we need a better error and some docs here
      throw new Error(`Story with id ${storyId} already exists in the store!

Perhaps you added the same story twice, or you have a name collision?
Story ids need to be unique -- ensure you aren't using the same names modolo url-sanitization.`);
    }

    _data[storyId] = toChild({
      kind,
      name: storyName,
      story,
      getDecorated,
      parameters,
      id: storyId,
      path: storyId,
      parent: rootAndGroups[rootAndGroups.length - 1].path,
      depth: rootAndGroups.length,
      isComponent: false,
      isRoot: false,
    });

    // LEGACY DATA
    this.addLegacyStory({ kind, name: storyName, story, getDecorated, parameters });

    // LET'S SEND IT TO THE MANAGER
    this.pushToManager();
  }

  pushToManager = debounce(() => {
    const stories = this.extract();

    // send to the parent frame.
    this._channel.emit(Events.SET_STORIES, { stories });
  }, 0);

  // OLD apis
  getRevision() {
    return this._revision;
  }

  incrementRevision() {
    this._revision += 1;
  }

  addLegacyStory({ kind, name, getDecorated, parameters = {} }) {
    const k = toKey(kind);
    if (!this._legacydata[k]) {
      this._legacydata[k] = {
        kind,
        fileName: parameters.fileName,
        index: getId(),
        stories: {},
      };
    }

    this._legacydata[k].stories[toKey(name)] = {
      name,
      // kind,
      index: getId(),
      fn: (...args) => getDecorated()(...args),
      parameters,
    };
  }

  getStoryKinds() {
    return Object.values(this._legacydata)
      .filter(kind => Object.keys(kind.stories).length > 0)
      .sort((info1, info2) => info1.index - info2.index)
      .map(info => info.kind);
  }

  getStories(kind) {
    const key = toKey(kind);
    if (!this._legacydata[key]) {
      return [];
    }

    return Object.keys(this._legacydata[key].stories)
      .map(name => this._legacydata[key].stories[name])
      .sort((info1, info2) => info1.index - info2.index)
      .map(info => info.name);
  }

  getStoryFileName(kind) {
    const key = toKey(kind);
    const storiesKind = this._legacydata[key];
    if (!storiesKind) {
      return null;
    }

    return storiesKind.fileName;
  }

  getStoryAndParameters(kind, name) {
    if (!kind || !name) {
      return null;
    }

    const storiesKind = this._legacydata[toKey(kind)];
    if (!storiesKind) {
      return null;
    }

    const storyInfo = storiesKind.stories[toKey(name)];
    if (!storyInfo) {
      return null;
    }

    const { fn, parameters } = storyInfo;
    return {
      story: fn,
      parameters,
    };
  }

  getStory(kind, name) {
    const data = this.getStoryAndParameters(kind, name);
    return data && data.story;
  }

  getStoryWithContext(kind, name) {
    const data = this.getStoryAndParameters(kind, name);
    if (!data) {
      return null;
    }

    const { story, parameters } = data;
    return () =>
      story({
        kind,
        story: name,
        parameters,
      });
  }

  removeStoryKind(kind) {
    if (this.hasStoryKind(kind)) {
      this._legacydata[toKey(kind)].stories = {};
    }
  }

  hasStoryKind(kind) {
    return Boolean(this._legacydata[toKey(kind)]);
  }

  hasStory(kind, name) {
    return Boolean(this.getStory(kind, name));
  }

  dumpStoryBook() {
    const data = this.getStoryKinds().map(kind => ({
      kind,
      stories: this.getStories(kind),
    }));

    return data;
  }

  size() {
    return Object.keys(this._legacydata).length;
  }

  clean() {
    this.getStoryKinds().forEach(kind => delete this._legacydata[toKey(kind)]);
  }
}
