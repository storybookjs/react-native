import AsyncStorage from '@react-native-async-storage/async-storage';
import { addons } from '@storybook/addons';
import Channel from '@storybook/channels';
import { ClientApi, ConfigApi, StoryStore } from '@storybook/client-api';
import { Loadable } from '@storybook/core-client';
import Events from '@storybook/core-events';
import { toId } from '@storybook/csf';
import { ThemeProvider } from 'emotion-theming';
import React from 'react';
import OnDeviceUI from './components/OnDeviceUI';
import { theme } from './components/Shared/theme';
import { loadCsf } from './loadCsf';

const STORAGE_KEY = 'lastOpenedStory';

interface AsyncStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
}

interface InitialSelection {
  /**
   * Kind is the default export name or the storiesOf("name") name
   */
  kind: string;

  /**
   * Name is the named export or the .add("name") name
   */
  name: string;
}

export type Params = {
  onDeviceUI?: boolean;
  resetStorybook?: boolean;
  disableWebsockets?: boolean;
  query?: string;
  host?: string;
  port?: number;
  secured?: boolean;
  initialSelection?: InitialSelection;
  shouldPersistSelection?: boolean;
  tabOpen?: number;
  isUIHidden?: boolean;
  shouldDisableKeyboardAvoidingView?: boolean;
  keyboardAvoidingViewVerticalOffset?: number;
} & { theme?: typeof theme };

export default class Preview {
  _clientApi: ClientApi;

  _storyStore: StoryStore;

  _addons: any;

  _channel: Channel;

  _decorators: any[];

  _asyncStorageStoryId: string;

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
    const { initialSelection, shouldPersistSelection } = params;
    this._setInitialStory(initialSelection, shouldPersistSelection);

    this._channel.on(Events.SET_CURRENT_STORY, (d: { storyId: string }) => {
      this._selectStoryEvent(d, shouldPersistSelection);
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

  _setInitialStory = async (initialSelection?: InitialSelection, shouldPersistSelection = true) => {
    const story = await this._getInitialStory(initialSelection, shouldPersistSelection);

    if (story) {
      this._selectStory(story);
    }
  };

  _getInitialStory = async (initialSelection?: InitialSelection, shouldPersistSelection = true) => {
    let story: string = null;
    const initialSelectionId = initialSelection
      ? toId(initialSelection.kind, initialSelection.name)
      : undefined;

    if (initialSelection && initialSelectionId && this._checkStory(initialSelectionId)) {
      story = initialSelectionId;
    } else if (shouldPersistSelection) {
      try {
        let value = this._asyncStorageStoryId;
        if (!value) {
          value = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
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

  _selectStoryEvent({ storyId }: { storyId: string }, shouldPersistSelection) {
    if (storyId) {
      if (shouldPersistSelection) {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storyId)).catch(() => {});
      }

      const story = this._getStory(storyId);
      this._selectStory(story);
    }
  }

  _selectStory(story: any) {
    this._storyStore.setSelection({ storyId: story.id, viewMode: 'story' });
    this._channel.emit(Events.SELECT_STORY, story);
  }

  _checkStory(storyId: string) {
    if (!storyId) {
      return null;
    }

    const story = this._getStory(storyId);

    if (story === null || story.storyFn === null) {
      return null;
    }

    return story;
  }
}
