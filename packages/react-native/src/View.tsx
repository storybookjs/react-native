import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Channel, WebsocketTransport } from '@storybook/core/channels';
import Events from '@storybook/core/core-events';
import { StoryContext, toId } from '@storybook/csf';
import { addons as managerAddons } from '@storybook/core/manager-api';
import { PreviewWithSelection, addons as previewAddons } from '@storybook/core/preview-api';
import type { ReactRenderer } from '@storybook/react';
import { Theme, ThemeProvider, darkTheme, theme } from '@storybook/react-native-theming';
import { Layout, transformStoryIndexToStoriesHash } from '@storybook/react-native-ui';
import type { API_IndexHash, PreparedStory, StoryId, StoryIndex } from '@storybook/core/types';
import dedent from 'dedent';
import deepmerge from 'deepmerge';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { ActivityIndicator, View as RNView, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StoryView from './components/StoryView';
import getHost from './rn-host-detect';
import { useSetStoryContext, useStoryContext } from './hooks';
import { PreviewReactNative } from './PreviewReactNative';

const STORAGE_KEY = 'lastOpenedStory';

interface Storage {
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
  storage?: Storage;
};

export class View {
  _storyIndex: StoryIndex;
  _setStory: (story: StoryContext<ReactRenderer>) => void = () => {};
  _forceRerender: () => void;
  _ready: boolean = false;
  _preview: PreviewReactNative;
  _asyncStorageStoryId: string;
  _webUrl: string;
  _storage: Storage;
  _channel: Channel;
  _idToPrepared: Record<string, PreparedStory<ReactRenderer>> = {};

  constructor(preview: PreviewReactNative, channel: Channel) {
    this._preview = preview;
    this._channel = channel;
  }

  _getInitialStory = async ({
    initialSelection,
    shouldPersistSelection = true,
  }: Partial<Params> = {}) => {
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

        if (!value && this._storage != null) {
          value = await this._storage.getItem(STORAGE_KEY);

          this._asyncStorageStoryId = value;
        }

        const exists = value && Object.keys(this._storyIndex.entries).includes(value);

        if (!exists) console.log('Storybook: could not find persisted story');

        return { storySpecifier: exists ? value : '*', viewMode: 'story' };
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

    const channel = new Channel({
      transport: new WebsocketTransport({
        url,
        onError: (e) => {
          console.log(`WebsocketTransport error ${JSON.stringify(e)}`);
        },
      }),
      async: true,
    });

    return channel;
  };

  createPreparedStoryMapping = async () => {
    await this._preview.initializationPromise.then(() =>
      Promise.all(
        Object.keys(this._storyIndex.entries).map(async (storyId: StoryId) => {
          this._idToPrepared[storyId] = await this._preview.loadStory({ storyId });
        })
      )
    );
  };

  getStorybookUI = (params: Partial<Params> = {}) => {
    const {
      shouldPersistSelection = true,
      onDeviceUI = true,
      enableWebsockets = false,
      storage,
    } = params;

    this._storage = storage;

    const initialStory = this._getInitialStory(params);

    if (enableWebsockets) {
      console.log('websockets enabled');

      const channel = this._getServerChannel(params);
      managerAddons.setChannel(channel);
      previewAddons.setChannel(channel);
      this._channel = channel;
      // @ts-ignore FIXME
      this._preview.channel = channel;
      this._preview.setupListeners();
      channel.emit(Events.CHANNEL_CREATED);
      this._preview.initializationPromise.then(() =>
        this._preview.initializeWithStoryIndex(this._storyIndex)
      );
    }

    managerAddons.loadAddons({
      store: () => ({
        fromId: (id) => {
          if (!this._ready) {
            throw new Error('Storybook is not ready yet');
          }
          return this._preview.getStoryContext(this._idToPrepared[id]);
        },
        getSelection: () => {
          return this._preview.currentSelection;
        },
        _channel: this._channel,
      }),
    });

    // eslint-disable-next-line consistent-this
    const self = this;

    return () => {
      const setContext = useSetStoryContext();
      const story = useStoryContext();
      const colorScheme = useColorScheme();
      const [update, forceUpdate] = useReducer((x) => x + 1, 0);
      const [ready, setReady] = useState(false);

      const appliedTheme = useMemo(
        () => deepmerge(colorScheme === 'dark' ? darkTheme : theme, params.theme ?? {}),
        [colorScheme]
      );

      useEffect(() => {
        this.createPreparedStoryMapping()
          .then(() => {
            this._ready = true;
            setReady(true);
          })
          .catch((e) => console.error(e));

        self._setStory = (newStory: StoryContext<ReactRenderer>) => {
          setContext(newStory);

          if (shouldPersistSelection && !storage) {
            console.warn(dedent`Please set storage in getStorybookUI like this:
              const StorybookUIRoot = view.getStorybookUI({
                storage: {
                  getItem: AsyncStorage.getItem,
                  setItem: AsyncStorage.setItem,
                },
              });
            `);
          }

          if (shouldPersistSelection && !!this._storage) {
            this._storage.setItem(STORAGE_KEY, newStory.id).catch((e) => {
              console.warn('storybook-log: error writing to async storage', e);
            });
          }
        };

        self._forceRerender = () => forceUpdate();

        initialStory.then((st) => {
          self._preview.selectionStore.selectionSpecifier = st;

          self._preview.selectSpecifiedStory();
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const storyHash: API_IndexHash = useMemo(() => {
        if (!ready) {
          return {};
        }

        return transformStoryIndexToStoriesHash(this._storyIndex, {
          docsOptions: { docsMode: false, autodocs: false, defaultName: '' },
          filters: {},
          status: {},
          provider: {
            handleAPI: () => ({}),
            getConfig: () => ({}),
          },
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [ready, update]);

      if (!ready) {
        return (
          <RNView
            style={{
              ...StyleSheet.absoluteFillObject,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator animating size={'large'} />
          </RNView>
        );
      }

      if (onDeviceUI) {
        return (
          <ThemeProvider theme={appliedTheme as Theme}>
            <SafeAreaProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                  {/* @ts-ignore something weird with story type */}
                  <Layout storyHash={storyHash} story={story}>
                    <StoryView />
                  </Layout>
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </ThemeProvider>
        );
      } else {
        return <StoryView />;
      }
    };
  };
}
