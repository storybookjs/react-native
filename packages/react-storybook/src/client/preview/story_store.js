/* eslint no-underscore-dangle: 0 */

let count = 0;

function getId() {
  count += 1;
  return count;
}

export default class StoryStore {
  constructor() {
    this._data = {};
  }

  addStory(kind, name, fn) {
    if (!this._data[kind]) {
      this._data[kind] = {
        kind,
        index: getId(),
        stories: {},
      };
    }

    this._data[kind].stories[name] = {
      name,
      index: getId(),
      fn,
    };
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

  getStory(kind, name) {
    const storiesKind = this._data[kind];
    if (!storiesKind) {
      return null;
    }

    const storyInfo = storiesKind.stories[name];
    if (!storyInfo) {
      return null;
    }

    return storyInfo.fn;
  }

  removeStoryKind(kind) {
    this._data[kind].stories = {};
  }

  hasStoryKind(kind) {
    return Boolean(this._data[kind]);
  }

  hasStory(kind, name) {
    return Boolean(this.getStory(kind, name));
  }

  dumpStoryBook() {
    const data = this.getStoryKinds().map(kind => ({ kind, stories: this.getStories(kind) }));

    return data;
  }

  size() {
    return Object.keys(this._data).length;
  }

  clean() {
    this.getStoryKinds().forEach(kind => delete this._data[kind]);
  }
}
