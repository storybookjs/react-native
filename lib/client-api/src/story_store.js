/* eslint no-underscore-dangle: 0 */
import EventEmitter from 'eventemitter3';
import Events from '@storybook/core-events';

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
  }

  getRevision() {
    return this._revision;
  }

  incrementRevision() {
    this._revision += 1;
  }

  addStory(kind, name, fn, parameters = {}) {
    if (!this._data[kind]) {
      this._data[kind] = {
        kind,
        fileName: parameters.fileName,
        index: getId(),
        stories: {},
      };
    }

    this._data[kind].stories[name] = {
      name,
      index: getId(),
      fn,
      parameters,
    };

    this.emit(Events.STORY_ADDED, kind, name, fn, parameters);
  }

  getStoryKinds() {
    return Object.keys(this._data)
      .map(key => this._data[key])
      .filter(kind => Object.keys(kind.stories).length > 0)
      .sort((info1, info2) => info1.index - info2.index)
      .map(info => info.kind);
  }

  getStories(kind) {
    if (!this._data[kind]) {
      return [];
    }

    return Object.keys(this._data[kind].stories)
      .map(name => this._data[kind].stories[name])
      .sort((info1, info2) => info1.index - info2.index)
      .map(info => info.name);
  }

  getStoryFileName(kind) {
    const storiesKind = this._data[kind];
    if (!storiesKind) {
      return null;
    }

    return storiesKind.fileName;
  }

  getStoryAndParameters(kind, name) {
    const storiesKind = this._data[kind];
    if (!storiesKind) {
      return null;
    }

    const storyInfo = storiesKind.stories[name];
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
      this._data[kind].stories = {};
    }
  }

  hasStoryKind(kind) {
    return Boolean(this._data[kind]);
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
    this.getStoryKinds().forEach(kind => delete this._data[kind]);
  }
}
