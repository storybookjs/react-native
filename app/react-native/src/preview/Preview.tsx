import { addons } from '@storybook/addons';
import Channel from '@storybook/channels';
import { ClientApi, ConfigApi, StoryStore } from '@storybook/client-api';
import { Loadable } from '@storybook/core-client';
import Events from '@storybook/core-events';
import { ThemeProvider } from 'emotion-theming';
import React from 'react';
import { loadCsf } from './loadCsf';
import OnDeviceUI from './components/OnDeviceUI';
import { theme } from './components/Shared/theme';

const STORAGE_KEY = 'lastOpenedStory';

interface AsyncStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
}

export type Params = {
  onDeviceUI: boolean;
  asyncStorage: AsyncStorage | null;
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

  _storyStore: StoryStore;

  _addons: any;

  _channel: Channel;

  _decorators: any[];

  _asyncStorageStoryId: string;

  _asyncStorage: AsyncStorage | null;

  _configApi: ConfigApi;

  configure: (loadable: Loadable, m: NodeModule, showDeprecationWarning: boolean) => void;

  constructor() {
    const channel = new Channel({ async: true });
    this._decorators = [];
    this._storyStore = new StoryStore({ channel });
    this._clientApi = new ClientApi({ storyStore: this._storyStore });
    this._configApi = new ConfigApi({ storyStore: this._storyStore });
    this._channel = channel;
    const configure = loadCsf({
      clientApi: this._clientApi,
      storyStore: this._storyStore,
      configApi: this._configApi,
    });
    this.configure = (...args) => configure('react-native', ...args);

    addons.setChannel(channel);
  }

  api = () => {
    return this._clientApi;
  };

  getStorybookUI = (params: Partial<Params> = {}) => {
    if (params.asyncStorage === undefined) {
      console.warn(
        `
    Starting Storybook v5.3.0, we require you to manually pass an asyncStorage prop. Pass null to disable or use https://github.com/react-native-async-storage/async-storage.

    More info: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#react-native-async-storage
          `.trim()
      );
    }

    const { initialSelection, shouldPersistSelection } = params;
    this._setInitialStory(initialSelection, shouldPersistSelection);
    if (params.asyncStorage) {
      this._asyncStorage = params.asyncStorage;
    }

    this._channel.on(Events.SET_CURRENT_STORY, (d: { storyId: string }) => {
      this._selectStoryEvent(d);
    });

    const { _storyStore } = this;

    addons.loadAddons(this._clientApi);

    const appliedTheme = { ...theme, ...params.theme };
    return () => (
      <ThemeProvider theme={appliedTheme}>
        <OnDeviceUI
          storyStore={_storyStore}
          isUIHidden={params.isUIHidden}
          tabOpen={params.tabOpen}
          shouldDisableKeyboardAvoidingView={params.shouldDisableKeyboardAvoidingView}
          keyboardAvoidingViewVerticalOffset={params.keyboardAvoidingViewVerticalOffset}
        />
      </ThemeProvider>
    );
  };

  _setInitialStory = async (initialSelection: any, shouldPersistSelection = true) => {
    const story = await this._getInitialStory(initialSelection, shouldPersistSelection);

    if (story) {
      this._selectStory(story);
    }
  };

  _getInitialStory = async (initialSelection: any, shouldPersistSelection = true) => {
    let story = null;
    if (initialSelection && this._checkStory(initialSelection)) {
      story = initialSelection;
    } else if (shouldPersistSelection) {
      try {
        let value = this._asyncStorageStoryId;
        if (!value && this._asyncStorage) {
          value = JSON.parse(await this._asyncStorage.getItem(STORAGE_KEY));
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

    const stories = this._storyStore.raw();
    if (stories && stories.length) {
      return this._getStory(stories[0].id);
    }

    return null;
  };

  _getStory(storyId: string) {
    return this._storyStore.fromId(storyId);
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
    this._storyStore.setSelection({ storyId: story.id, viewMode: 'story' });
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
