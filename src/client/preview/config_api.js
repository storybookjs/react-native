import {
  setInitialStory,
  setError,
  clearError,
} from './actions';

import { clearDecorators } from './';

export default class ConfigApi {
  constructor({ channel, storyStore, reduxStore }) {
    // channel can be null when running in node
    // always check whether channel is available
    this._channel = channel;
    this._storyStore = storyStore;
    this._reduxStore = reduxStore;
  }

  _renderMain(loaders) {
    if (loaders) loaders();

    const stories = this._storyStore.dumpStoryBook();
    // send to the parent frame.
    this._channel.emit('setStories', { stories });

    // clear the error if exists.
    this._reduxStore.dispatch(clearError());
    this._reduxStore.dispatch(setInitialStory(stories));
  }

  _renderError(e) {
    const { stack, message } = e;
    const error = { stack, message };
    this._reduxStore.dispatch(setError(error));
  }

  configure(loaders, module) {
    const render = () => {
      try {
        this._renderMain(loaders);
      } catch (error) {
        this._renderError(error);
      }
    };

    if (module.hot) {
      module.hot.accept(() => {
        setTimeout(render);
      });
      module.hot.dispose(() => {
        clearDecorators();
      });
    }

    if (this._channel) {
      render();
    } else {
      loaders();
    }
  }
}
