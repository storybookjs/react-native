/* eslint no-underscore-dangle: 0 */
import { EventEmitter } from 'events';
import Events from '@storybook/core-events';
// import toCamelCase from 'to-camel-case';
import qs from 'qs';
import { window, history } from 'global';

const toKey = input =>
  input.replace(/[^a-z0-9]+([a-z0-9])/gi, (...params) => params[1].toUpperCase());

let count = 0;

function getId() {
  count += 1;
  return count;
}

export default class StoryStore extends EventEmitter {
  constructor() {
    super();

    this._data = {};
    this._revision = 0;
    this._selection = {};

    this.on(Events.STORY_INIT, () => {
      this.setSelection(this.fromPath(this.getPath()));
    });
  }

  setSelection = data => {
    this._selection = data;
    window.setTimeout(() => this.emit(Events.STORY_RENDER), 1);
  };

  getSelection = () => this._selection;

  getRevision() {
    return this._revision;
  }

  incrementRevision() {
    this._revision += 1;
  }

  getPath = () => {
    const { path } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    return path;
  };

  setPath = input => {
    const query = input.split('?')[1] || '';
    const { path, ...rest } = qs.parse(query, { ignoreQueryPrefix: true });
    const location = `iframe.html?${qs.stringify({ ...rest, path }, { encode: false })}`;
    console.log({ location });
    history.replaceState({}, '', location);
    return path;
  };

  fromPath = path => {
    const kinds = (path.split('/components/')[1] || '').split('-');
    let name = kinds.pop();
    let kind = toKey(kinds.join('-'));

    if (!kind || !name) {
      const [t] = Object.entries(this._data);
      [kind] = t;
      [{ name }] = Object.values(this._data[kind].stories);
    }

    try {
      const data = this._data[kind].stories[name];

      const options = {
        kind: this._data[kind].kind,
        name: data.name,
        index: data.index,
        parameters: data.parameters,
      };

      return {
        ...options,
        story: () => data.fn(options),
      };
    } catch (e) {
      console.log('failed to get story:', { name, kind, kinds, path, data: this._data });
      console.error(e);
      return {};
    }
  };

  addStory(kind, name, fn, parameters = {}) {
    const k = toKey(kind);
    if (!this._data[k]) {
      this._data[k] = {
        kind,
        fileName: parameters.fileName,
        index: getId(),
        stories: {},
      };
    }

    this._data[k].stories[toKey(name)] = {
      name,
      index: getId(),
      fn,
      parameters,
    };

    this.emit(Events.STORY_ADDED, kind, name, fn, parameters);
  }

  getStoryKinds() {
    return Object.values(this._data)
      .filter(kind => Object.keys(kind.stories).length > 0)
      .sort((info1, info2) => info1.index - info2.index)
      .map(info => info.kind);
  }

  getStories(kind) {
    if (!this._data[toKey(kind)]) {
      return [];
    }

    return Object.keys(this._data[toKey(kind)].stories)
      .map(name => this._data[toKey(kind)].stories[name])
      .sort((info1, info2) => info1.index - info2.index)
      .map(info => info.name);
  }

  getStoryFileName(kind) {
    const storiesKind = this._data[toKey(kind)];
    if (!storiesKind) {
      return null;
    }

    return storiesKind.fileName;
  }

  getStoryAndParameters(kind, name) {
    if (!kind || !name) {
      return null;
    }

    const storiesKind = this._data[toKey(kind)];
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
      this._data[toKey(kind)].stories = {};
    }
  }

  hasStoryKind(kind) {
    return Boolean(this._data[toKey(kind)]);
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
    return Object.keys(this._data).length;
  }

  clean() {
    this.getStoryKinds().forEach(kind => delete this._data[toKey(kind)]);
  }
}
