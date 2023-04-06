import React, { useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoryIndex, SelectionSpecifier } from '@storybook/store';
import { StoryContext, toId } from '@storybook/csf';
import { addons } from '@storybook/addons';
import { ThemeProvider } from 'emotion-theming';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSetStoryContext, syncExternalUI } from '../hooks';
import OnDeviceUI from './components/OnDeviceUI';
import { darkTheme, theme, Theme } from './components/Shared/theme';
import type { ReactNativeFramework } from '../types/types-6.0';
import { PreviewWeb } from '@storybook/preview-web';
import StoryView from './components/StoryView';
import createChannel from '@storybook/channel-websocket';
import getHost from './rn-host-detect';
import events from '@storybook/core-events';
import { useColorScheme } from 'react-native';
import deepmerge from 'deepmerge';

const STORAGE_KEY = 'lastOpenedStory';

interface AsyncStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
}

type StoryKind = string;

type StoryName = string;

type InitialSelection =
  | `${StoryKind}--${StoryName}`
  | {
      /**
       * Kind is the default export name or the storiesOf("name") name
       */
      kind: StoryKind;

      /**
       * Name is the named export or the .add("name") name
       */
      name: StoryName;
    };

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type Params = {
  onDeviceUI?: boolean;
  // resetStorybook?: boolean; // TODO: Do we need this?
  enableWebsockets?: boolean;
  query?: string;
  host?: string;
  port?: number;
  secured?: boolean;
  initialSelection?: InitialSelection;
  shouldPersistSelection?: boolean;
  tabOpen?: number;
  isUIHidden?: boolean;
  isSplitPanelVisible?: boolean;
  shouldDisableKeyboardAvoidingView?: boolean;
  keyboardAvoidingViewVerticalOffset?: number;
  theme: DeepPartial<Theme>;
};

export class View {
  _storyIndex: StoryIndex;
  _setStory: (story: StoryContext<ReactNativeFramework>) => void = () => {};
  _forceRerender: () => void;
  _ready: boolean = false;
  _preview: PreviewWeb<ReactNativeFramework>;
  _asyncStorageStoryId: string;
  _webUrl: string;

  constructor(preview: PreviewWeb<ReactNativeFramework>) {
    this._preview = preview;
  }
  _getInitialStory = async ({
    initialSelection,
    shouldPersistSelection = true,
  }: Partial<Params> = {}): Promise<SelectionSpecifier> => {
    if (initialSelection) {
      if (typeof initialSelection === 'string') {
        return { storySpecifier: initialSelection, viewMode: 'story' };
      } else {
        return {
          storySpecifier: toId(initialSelection.kind, initialSelection.name),
          viewMode: 'story',
        };
      }
    }

    if (shouldPersistSelection) {
      try {
        let value = this._asyncStorageStoryId;

        if (!value) {
          value = await AsyncStorage.getItem(STORAGE_KEY);

          this._asyncStorageStoryId = value;
        }

        return { storySpecifier: value ?? '*', viewMode: 'story' };
      } catch (e) {
        console.warn('storybook-log: error reading from async storage', e);
      }
    }

    return { storySpecifier: '*', viewMode: 'story' };
  };

  _getServerChannel = (params: Partial<Params> = {}) => {
    const host = getHost(params.host || 'localhost');

    const port = `:${params.port || 7007}`;

    const query = params.query || '';

    const websocketType = params.secured ? 'wss' : 'ws';

    const url = `${websocketType}://${host}${port}/${query}`;

    return createChannel({
      url,
      async: true,
      onError: async () => {},
    });
  };

  getStorybookUI = (params: Partial<Params> = {}) => {
    const { shouldPersistSelection = true, onDeviceUI = true, enableWebsockets = false } = params;

    const initialStory = this._getInitialStory(params);

    if (enableWebsockets) {
      const channel = this._getServerChannel(params);

      addons.setChannel(channel);

      // TODO: check this with someone who knows what they're doing
      this._preview.channel = channel;

      this._preview.setupListeners();

      channel.emit(events.CHANNEL_CREATED);

      this._preview.initializeWithStoryIndex(this._storyIndex);
    }

    addons.loadAddons({
      store: () => ({
        fromId: (id) =>
          this._preview.storyStore.getStoryContext(this._preview.storyStore.fromId(id)),
        getSelection: () => {
          return this._preview.currentSelection;
        },
        _channel: this._preview.channel,
      }),
    });

    // eslint-disable-next-line consistent-this
    const self = this;


    // Sync the Storybook parameters (external) with app UI state (internal), to initialise them.
    syncExternalUI({
      isUIVisible: params.isUIHidden !== undefined ? !params.isUIHidden : undefined,
      isSplitPanelVisible: params.isSplitPanelVisible,
    });

    return () => {
      const setContext = useSetStoryContext();
      const colorScheme = useColorScheme();
      const [, forceUpdate] = useReducer((x) => x + 1, 0);

      const appliedTheme = useMemo(() => deepmerge(
        colorScheme === 'dark' ? darkTheme : theme,
        params.theme ?? {}
      ), [colorScheme]);

      useEffect(() => {
        self._setStory = (newStory: StoryContext<ReactNativeFramework>) => {
          setContext(newStory);

          if (shouldPersistSelection) {
            AsyncStorage.setItem(STORAGE_KEY, newStory.id).catch((e) => {
              console.warn('storybook-log: error writing to async storage', e);
            });
          }
        };

        self._forceRerender = () => forceUpdate();

        initialStory.then((story) => {
          self._preview.urlStore.selectionSpecifier = story;

          self._preview.selectSpecifiedStory();
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      if (onDeviceUI) {
        return (
          <SafeAreaProvider>
            <ThemeProvider theme={appliedTheme}>
              <OnDeviceUI
                storyIndex={self._storyIndex}
                tabOpen={params.tabOpen}
                shouldDisableKeyboardAvoidingView={params.shouldDisableKeyboardAvoidingView}
                keyboardAvoidingViewVerticalOffset={params.keyboardAvoidingViewVerticalOffset}
              />
            </ThemeProvider>
          </SafeAreaProvider>
        );
      } else {
        return <StoryView />;
      }
    };
  };
}
