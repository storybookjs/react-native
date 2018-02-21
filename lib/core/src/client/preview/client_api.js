/* eslint no-underscore-dangle: 0 */

import { logger } from '@storybook/client-logger';

import StoryStore from './story_store';

const defaultDecorateStory = (getStory, decorators) =>
  decorators.reduce(
    (decorated, decorator) => context => decorator(() => decorated(context), context),
    getStory
  );

export default class ClientApi {
  constructor({ storyStore = new StoryStore(), decorateStory = defaultDecorateStory } = {}) {
    this._storyStore = storyStore;
    this._addons = {};
    this._globalDecorators = [];
    this._decorateStory = decorateStory;
  }

  setAddon = addon => {
    this._addons = {
      ...this._addons,
      ...addon,
    };
  };

  addDecorator = decorator => {
    this._globalDecorators.push(decorator);
  };

  clearDecorators = () => {
    this._globalDecorators = [];
  };

  storiesOf = (kind, m) => {
    if (!kind && typeof kind !== 'string') {
      throw new Error('Invalid or missing kind provided for stories, should be a string');
    }

    if (!m) {
      logger.warn(
        `Missing 'module' parameter for story with a kind of '${kind}'. It will break your HMR`
      );
    }

    if (m && m.hot && m.hot.dispose) {
      m.hot.dispose(() => {
        this._storyStore.removeStoryKind(kind);
        this._storyStore.incrementRevision();
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

      const fileName = m ? m.filename : null;

      // Add the fully decorated getStory function.
      this._storyStore.addStory(
        kind,
        storyName,
        this._decorateStory(getStory, decorators),
        fileName
      );
      return api;
    };

    api.addDecorator = decorator => {
      localDecorators.push(decorator);
      return api;
    };

    return api;
  };

  getStorybook = () =>
    this._storyStore.getStoryKinds().map(kind => {
      const fileName = this._storyStore.getStoryFileName(kind);

      const stories = this._storyStore.getStories(kind).map(name => {
        const render = this._storyStore.getStory(kind, name);
        return { name, render };
      });

      return { kind, fileName, stories };
    });
}
