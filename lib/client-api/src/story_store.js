/* eslint no-underscore-dangle: 0 */
import { history, document } from 'global';
import qs from 'qs';
import EventEmitter from 'eventemitter3';
import memoize from 'memoizerific';
import debounce from 'lodash.debounce';
import { stripIndents } from 'common-tags';

import Events from '@storybook/core-events';
import { logger } from '@storybook/client-logger';
import { toId } from '@storybook/router/utils';

import pathToId from './pathToId';
import { getQueryParams } from './queryparams';

// TODO: these are copies from components/nav/lib
// refactor to DRY

const toKey = input =>
  input.replace(/[^a-z0-9]+([a-z0-9])/gi, (...params) => params[1].toUpperCase());

const toChild = it => ({ ...it });

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

const getIdFromLegacyQuery = ({ path, selectedKind, selectedStory }) =>
  (path && pathToId(path)) || (selectedKind && selectedStory && toId(selectedKind, selectedStory));

export default class StoryStore extends EventEmitter {
  constructor(params) {
    super();

    this._legacydata = {};
    this._data = {};
    this._revision = 0;
    this._selection = {};
    this._channel = params.channel;

    this.on(Events.STORY_INIT, () => {
      let storyId = this.getIdOnPath();
      if (!storyId) {
        const query = getQueryParams();
        storyId = getIdFromLegacyQuery(query);
        if (storyId) {
          const { path, selectedKind, selectedStory, ...rest } = query;
          this.setPath(storyId, rest);
        }
      }
      this.setSelection(this.fromId(storyId));
    });
  }

  setChannel = channel => {
    this._channel = channel;
  };

  // NEW apis

  getIdOnPath = () => {
    const { id } = getQueryParams();
    return id;
  };

  setPath = (storyId, params = {}) => {
    const path = `${document.location.pathname}?${qs.stringify({ ...params, id: storyId })}`;
    history.replaceState({}, '', path);
  };

  fromId = id => {
    try {
      const data = this._data[id];

      if (!data || !data.getDecorated) {
        return null;
      }

      return data;
    } catch (e) {
      logger.warn('failed to get story:', this._data);
      logger.error(e);
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

  remove = id => {
    const { _data } = this;
    delete _data[id];
  };

  addStory(
    { id, kind, name, storyFn: original, parameters = {} },
    { getDecorators, applyDecorators }
  ) {
    const { _data } = this;

    if (_data[id]) {
      logger.warn(stripIndents`
        Story with id ${id} already exists in the store!

        Perhaps you added the same story twice, or you have a name collision?
        Story ids need to be unique -- ensure you aren't using the same names modolo url-sanitization.
      `);
    }

    const identification = {
      id,
      kind,
      name,
      story: name, // legacy
    };

    // immutable original storyFn
    const getOriginal = () => original;

    // lazily decorate the story when it's loaded
    const getDecorated = memoize(1)(() => applyDecorators(getOriginal(), getDecorators()));

    const storyFn = p => getDecorated()({ ...identification, parameters: { ...parameters, ...p } });

    _data[id] = toChild({
      ...identification,

      getDecorated,
      getOriginal,
      storyFn,

      parameters,
    });

    // LEGACY DATA
    this.addLegacyStory({ kind, name, storyFn, parameters });

    // LET'S SEND IT TO THE MANAGER
    this.pushToManager();
  }

  pushToManager = debounce(() => {
    if (this._channel) {
      const stories = this.extract();

      // send to the parent frame.
      this._channel.emit(Events.SET_STORIES, { stories });
    }
  }, 0);

  // OLD apis
  getRevision() {
    return this._revision;
  }

  incrementRevision() {
    this._revision += 1;
  }

  addLegacyStory({ kind, name, storyFn, parameters = {} }) {
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
      story: storyFn,
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

    const { story, parameters } = storyInfo;
    return {
      story,
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

    const { story } = data;
    return story;
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
