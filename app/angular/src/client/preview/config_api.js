/* eslint-disable no-underscore-dangle */

import { location } from 'global';
import { setInitialStory, setError, clearError } from './actions';
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
        if (module.hot && module.hot.status() === 'apply') {
          // We got this issue, after webpack fixed it and applying it.
          // Therefore error message is displayed forever even it's being fixed.
          // So, we'll detect it reload the page.
          location.reload();
        } else {
          // If we are accessing the site, but the error is not fixed yet.
          // There we can render the error.
          this._renderError(error);
        }
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
