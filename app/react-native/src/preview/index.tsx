/* eslint-disable no-underscore-dangle */
import React, { PureComponent } from 'react';
import { ThemeProvider } from 'emotion-theming';

import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import Channel from '@storybook/channels';
import createChannel from '@storybook/channel-websocket';
import { StoryStore, ClientApi } from '@storybook/client-api';
import OnDeviceUI from './components/OnDeviceUI';
import StoryView from './components/StoryView';
import { theme } from './components/Shared/theme';
// @ts-ignore
import getHost from './rn-host-detect';

const STORAGE_KEY = 'lastOpenedStory';

interface AsyncStorage {
  getItem: <T>(key: string) => Promise<T>;
  setItem: <T>(key: string, value: T) => Promise<void>;
}

export type Params = {
  onDeviceUI: boolean;
  asyncStorage?: AsyncStorage | null;
  resetStorybook: boolean;
  disableWebsockets: boolean;
  query: string;
  host: string;
  port: number;
  secured: boolean;
  initialSelection: any;
  shouldPersistSelection: boolean;
  tabOpen: number;
  isUIHidden: boolean;
  shouldDisableKeyboardAvoidingView: boolean;
  keyboardAvoidingViewVerticalOffset: number;
} & { theme: typeof theme };

export default class Preview {
  _clientApi: ClientApi;

  _stories: StoryStore;

  _addons: any;

  _decorators: any[];

  _asyncStorageStoryId: string;

  _asyncStorage: AsyncStorage | null;

  constructor() {
    this._addons = {};
    this._decorators = [];
    this._stories = new StoryStore({ channel: null });
    this._clientApi = new ClientApi({ storyStore: this._stories });
  }

  api = () => {
    return this._clientApi;
  };

  configure = (loadStories: () => void, module: any) => {
    loadStories();
    if (module && module.hot) {
      module.hot.accept(() => this._sendSetStories());
      // TODO remove all global decorators on dispose
    }
  };

  getStorybookUI = (params: Partial<Params> = {}) => {
    let webUrl: string = null;
    let channel: Channel = null;

    if (params.asyncStorage === undefined) {
      console.warn(
        `
Starting Storybook v5.3.0, we require to manually pass an asyncStorage prop. Pass null to disable or use one from @react-native-community or react-native itself.

More info: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#react-native-async-storage
      `.trim()
      );
    }

    if (params.asyncStorage) {
      this._asyncStorage = params.asyncStorage;
    }

    const onDeviceUI = params.onDeviceUI !== false;
    const { initialSelection, shouldPersistSelection } = params;

    try {
      channel = addons.getChannel();
    } catch (e) {
      // getChannel throws if the channel is not defined,
      // which is fine in this case (we will define it below)
    }

    if (!channel || params.resetStorybook) {
      if (onDeviceUI && params.disableWebsockets) {
        channel = new Channel({ async: true });
        this._setInitialStory(initialSelection, shouldPersistSelection);
      } else {
        const host = getHost(params.host || 'localhost');
        const port = `:${params.port || 7007}`;

        const query = params.query || '';
        const { secured } = params;
        const websocketType = secured ? 'wss' : 'ws';
        const httpType = secured ? 'https' : 'http';

        const url = `${websocketType}://${host}${port}/${query}`;
        webUrl = `${httpType}://${host}${port}`;
        channel = createChannel({
          url,
          async: onDeviceUI,
          onError: () => {
            this._setInitialStory(initialSelection, shouldPersistSelection);
          },
        });
      }

      addons.setChannel(channel);
      this._stories.setChannel(channel);

      channel.emit(Events.CHANNEL_CREATED);
    }

    channel.on(Events.GET_STORIES, () => this._sendSetStories());
    channel.on(Events.SET_CURRENT_STORY, d => this._selectStoryEvent(d));

    this._sendSetStories();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const preview = this;

    addons.loadAddons(this._clientApi);

    const appliedTheme = { ...theme, ...params.theme };

    // react-native hot module loader must take in a Class - https://github.com/facebook/react-native/issues/10991
    return class StorybookRoot extends PureComponent {
      render() {
        if (onDeviceUI) {
          return (
            <ThemeProvider theme={appliedTheme}>
              <OnDeviceUI
                stories={preview._stories}
                url={webUrl}
                isUIHidden={params.isUIHidden}
                tabOpen={params.tabOpen}
                shouldDisableKeyboardAvoidingView={params.shouldDisableKeyboardAvoidingView}
                keyboardAvoidingViewVerticalOffset={params.keyboardAvoidingViewVerticalOffset}
              />
            </ThemeProvider>
          );
        }

        return (
          <ThemeProvider theme={appliedTheme}>
            <StoryView stories={preview._stories} url={webUrl} />
          </ThemeProvider>
        );
      }
    };
  };

  _sendSetStories() {
    const channel = addons.getChannel();
    const stories = this._stories.extract();
    channel.emit(Events.SET_STORIES, { stories });
    channel.emit(Events.STORIES_CONFIGURED);
  }

  _setInitialStory = async (initialSelection: any, shouldPersistSelection = true) => {
    const story = await this._getInitialStory(initialSelection, shouldPersistSelection)();

    if (story) {
      this._selectStory(story);
    }
  };

  _getInitialStory = (initialSelection: any, shouldPersistSelection = true) => async () => {
    let story = null;
    if (initialSelection && this._checkStory(initialSelection)) {
      story = initialSelection;
    } else if (shouldPersistSelection) {
      try {
        let value = this._asyncStorageStoryId;
        if (!value && this._asyncStorage) {
          value = JSON.parse(await this._asyncStorage.getItem<string>(STORAGE_KEY));
          this._asyncStorageStoryId = value;
        }

        if (this._checkStory(value)) {
          story = value;
        }
      } catch (e) {
        //
      }
    }

    if (story) {
      return this._getStory(story);
    }

    const stories = this._stories.raw();
    if (stories && stories.length) {
      return this._getStory(stories[0].id);
    }

    return null;
  };

  _getStory(storyId: string) {
    return this._stories.fromId(storyId);
  }

  _selectStoryEvent({ storyId }: { storyId: string }) {
    if (storyId) {
      if (this._asyncStorage) {
        this._asyncStorage.setItem(STORAGE_KEY, JSON.stringify(storyId)).catch(() => {});
      }

      const story = this._getStory(storyId);
      this._selectStory(story);
    }
  }

  _selectStory(story: any) {
    const channel = addons.getChannel();

    this._stories.setSelection({ storyId: story.id, viewMode: 'story' }, null);
    channel.emit(Events.SELECT_STORY, story);
  }

  _checkStory(storyId: string) {
    if (!storyId) {
      return null;
    }

    const story = this._getStory(storyId);

    if (story.storyFn === null) {
      return null;
    }

    return story;
  }
}
