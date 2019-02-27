/* eslint no-underscore-dangle: 0 */

import { location } from 'global';
import Events from '@storybook/core-events';
import { logger } from '@storybook/client-logger';

export default class ConfigApi {
  constructor({ channel, storyStore, clearDecorators, clientApi }) {
    // channel can be null when running in node
    // always check whether channel is available
    this._channel = channel;
    this._storyStore = storyStore;
    this._clearDecorators = clearDecorators;
    this.clientApi = clientApi;
  }

  _renderMain() {
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
      const errors = [];

      try {
        if (loaders) {
          loaders();
        }
      } catch (e) {
        logger.error(e);
        errors.push(e);
      }
      try {
        this._renderMain();
      } catch (e) {
        logger.error(e);
        errors.push(e);
      }

      if (errors.length) {
        if (module.hot && module.hot.status() === 'apply') {
          // We got this issue, after webpack fixed it and applying it.
          // Therefore error message is displayed forever even it's being fixed.
          // So, we'll detect it reload the page.
          logger.error('RELOAD THE PAGE', 'module.hot.status() === apply');
          location.reload();
        } else {
          // If we are accessing the site, but the error is not fixed yet.
          // There we can render the error.
          this._renderError(errors[0]);

          // Clear out the store as chances as only some of the stories will have
          // made it in before the error was thrown
          // this._storyStore.clean();
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
      // in Browser
      render();
      // Send a signal to the manager that configure() is done. We do this in a timeout
      // because the story_store sends stories in a debounced function, which results in
      // as setTimeout. We want to ensure this happens after, to avoid a FOUC.
      setTimeout(() => this._channel.emit(Events.STORIES_CONFIGURED), 0);
    } else {
      // in NodeJS
      loaders();
    }
  };
}
