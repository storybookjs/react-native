/* eslint no-underscore-dangle: 0 */

import Events from '@storybook/core-events';
import { logger } from '@storybook/client-logger';
import { PostmsgTransport } from '@storybook/channel-postmessage';
import Channel from '@storybook/channels';
import { ClientApi, StoryStore, IModule } from './types';

interface IChannel {
  events: {
    forceReRender: [];
    registerSubscription: [];
    setCurrentStory: [];
    'storybook/a11y/request': [];
  };
  isAsync: boolean;
  sender: string;
  transport: PostmsgTransport;
}

export default class ConfigApi {
  _channel: Channel;

  _storyStore: StoryStore;

  _clearDecorators: () => void;

  clientApi: ClientApi;

  constructor({
    channel,
    storyStore,
    clearDecorators,
    clientApi,
  }: {
    channel: Channel | null;
    storyStore: StoryStore;
    clearDecorators: any;
    clientApi: ClientApi;
  }) {
    // channel can be null when running in node
    // always check whether channel is available
    this._channel = channel;
    this._storyStore = storyStore;
    this._clearDecorators = clearDecorators;
    this.clientApi = clientApi;
  }

  _renderMain() {
    // do initial render of story
    debugger;
    this._storyStore.emit(Events.STORY_INIT);
  }

  _renderError(err: Error) {
    const { stack, message } = err;
    const error = { stack, message };
    this._storyStore.setSelection({ error });
  }

  configure = (loaders: () => void, module: IModule) => {
    const render = () => {
      const errors = [];

      try {
        if (loaders) {
          loaders();
        }
      } catch (e) {
        errors.push(e);
      }

      if (!errors.length) {
        try {
          this._renderMain();
        } catch (e) {
          errors.push(e);
        }
      }

      if (errors.length) {
        this._storyStore.setSelection(undefined, errors[0]);

        throw errors[0];
      } else {
        this._storyStore.setSelection(undefined, null);
      }
    };

    if (m.hot) {
      m.hot.accept();
      m.hot.dispose(() => {
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
