/* eslint-disable no-underscore-dangle */

export default class ClientApi {
  constructor({ channel, storyStore }) {
    // channel can be null when running in node
    // always check whether channel is available
    this._channel = channel;
    this._storyStore = storyStore;
    this._addons = {};
    this._globalDecorators = [];
  }

  setAddon(addon) {
    this._addons = {
      ...this._addons,
      ...addon,
    };
  }

  addDecorator(decorator) {
    this._globalDecorators.push(decorator);
  }

  clearDecorators() {
    this._globalDecorators = [];
  }

  storiesOf(kind, m) {
    if (!kind && typeof kind !== 'string') {
      throw new Error('Invalid or missing kind provided for stories, should be a string');
    }

    if (m && m.hot) {
      m.hot.dispose(() => {
        this._storyStore.removeStoryKind(kind);
      });
    }

    const localDecorators = [];
    const api = {
      kind,
    };

    // apply addons
    Object.keys(this._addons).forEach(name => {
      const addon = this._addons[name];
      api[name] = (...args) => {
        addon.apply(api, args);
        return api;
      };
    });

    api.add = (storyName, getStory) => {
      if (typeof storyName !== 'string') {
        throw new Error(`Invalid or missing storyName provided for a "${kind}" story.`);
      }

      if (this._storyStore.hasStory(kind, storyName)) {
        throw new Error(`Story of "${kind}" named "${storyName}" already exists`);
      }

      // Wrap the getStory function with each decorator. The first
      // decorator will wrap the story function. The second will
      // wrap the first decorator and so on.
      const decorators = [...localDecorators, ...this._globalDecorators];

      const getDecoratedStory = decorators.reduce(
        (decorated, decorator) => context => decorator(() => decorated(context), context),
        getStory
      );

      // Add the fully decorated getStory function.
      this._storyStore.addStory(kind, storyName, getDecoratedStory);
      return api;
    };

    api.addDecorator = decorator => {
      localDecorators.push(decorator);
      return api;
    };

    return api;
  }

  getStorybook() {
    return this._storyStore.getStoryKinds().map(kind => {
      const stories = this._storyStore.getStories(kind).map(name => {
        const render = this._storyStore.getStory(kind, name);
        return { name, render };
      });
      return { kind, stories };
    });
  }
}
