/* eslint no-underscore-dangle: 0 */

import { location } from 'global';
import Events from '@storybook/core-events';

export default class ConfigApi {
  constructor({ channel, storyStore, clearDecorators }) {
    // channel can be null when running in node
    // always check whether channel is available
    this._channel = channel;
    this._storyStore = storyStore;
    this._clearDecorators = clearDecorators;
  }

  _renderMain(loaders) {
    if (loaders) {
      loaders();
    }

    const stories = this._storyStore.dumpStoryBook();

    // send to the parent frame.
    this._channel.emit(Events.SET_STORIES, { stories });

    // do initial render of story
    this._storyStore.emit(Events.STORY_INIT);
  }

  _renderError(e) {
    const { stack, message } = e;
    const error = { stack, message };
    this._storyStore.setSelection({ error });
  }

  configure = (loaders, module) => {
    const render = () => {
      try {
        this._renderMain(loaders);
      } catch (error) {
        if (module.hot && module.hot.status() === 'apply') {
          // We got this issue, after webpack fixed it and applying it.
          // Therefore error message is displayed forever even it's being fixed.
          // So, we'll detect it reload the page.
          console.error('RELOAD THE PAGE', 'module.hot.status() === apply');
          location.reload();
        } else {
          // If we are accessing the site, but the error is not fixed yet.
          // There we can render the error.
          this._renderError(error);

          // Clear out the store as chances as only some of the stories will have
          // made it in before the error was thrown
          this._storyStore.clean();
        }
      }
    };

    if (module.hot) {
      module.hot.accept(() => {
        setTimeout(render);
      });
      module.hot.dispose(() => {
        this._clearDecorators();
      });
    }

    if (this._channel) {
      render();
    } else {
      loaders();
    }
  };
}
