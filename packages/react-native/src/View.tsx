import { StoryContext, toId } from 'storybook/internal/csf';
import type { ReactRenderer } from '@storybook/react';
import { Theme, darkTheme, theme } from '@storybook/react-native-theming';
import { type SBUI, transformStoryIndexToStoriesHash } from '@storybook/react-native-ui-common';
import { Channel, WebsocketTransport } from 'storybook/internal/channels';
import { CHANNEL_CREATED, SET_CURRENT_STORY } from 'storybook/internal/core-events';
import { addons as managerAddons } from 'storybook/manager-api';
import { PreviewWithSelection, addons as previewAddons } from 'storybook/internal/preview-api';
import type { API_IndexHash, PreparedStory, StoryId, StoryIndex } from 'storybook/internal/types';
import dedent from 'dedent';
import { patchChannelForRN } from './patchChannelForRN';
import deepmerge from 'deepmerge';
import { useEffect, useMemo, useReducer, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  View as RNView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import StoryView from './components/StoryView';
import { useSetStoryContext, useStoryContext } from './hooks';
import {
  RN_STORYBOOK_EVENTS,
  RN_STORYBOOK_STORAGE_KEY,
  STORYBOOK_STORY_ID_PARAM,
} from './constants';

function resolveStoryBackgroundColor(
  story?: StoryContext<ReactRenderer> | null
): string | undefined {
  const backgroundGlobal = story?.globals?.backgrounds?.value;
  const bgParams = story?.parameters?.backgrounds;

  const backgroundName = backgroundGlobal;

  if (!backgroundName) return undefined;

  if (bgParams?.options?.[backgroundName]?.value) {
    return bgParams.options[backgroundName].value;
  }

  // Direct color value (e.g. hex)
  if (backgroundName.startsWith('#')) return backgroundName;

  return undefined;
}

export interface Storage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
}

type StoryKind = string;

type StoryName = string;

export type InitialSelection =
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

export type ThemePartial = DeepPartial<Theme>;

export type Params = {
  onDeviceUI?: boolean;
  /**
   * Set as false to disable the wrapper around the story view.
   * NOTE We may remove this in the future for a better solution.
   * default: true
   */
  hasStoryWrapper?: boolean;
  /**
   * Enable websockets for the storybook server to remotely control the storybook
   * default: false
   */
  enableWebsockets?: boolean;
  query?: string;
  /** The host for the websocket server. default: localhost */
  host?: string;
  /** The port for the websocket server. default: 7007 */
  port?: number;
  secured?: boolean;
  /** The initial story */
  initialSelection?: InitialSelection;
  /** Whether to persist story selection. default: true */
  shouldPersistSelection?: boolean;
  theme: ThemePartial;
  /** Used for persisting story selection. required. */
  storage?: Storage;
  /** The custom UI component to use instead of the default UI */
  CustomUIComponent?: SBUI;
};

export class View {
  _storyIndex: StoryIndex;
  _setStory: (story: StoryContext<ReactRenderer>) => void = () => {};
  _forceRerender: () => void = () => {};
  _ready: boolean = false;
  _preview: PreviewWithSelection<ReactRenderer>;
  _asyncStorageStoryId: string;
  _webUrl: string;
  _storage: Storage;
  _channel: Channel;
  _idToPrepared: Record<string, PreparedStory<ReactRenderer>> = {};

  constructor(preview: PreviewWithSelection<ReactRenderer>, channel: Channel) {
    this._preview = preview;
    this._channel = channel;
  }

  _storyIdExists = (storyId: string) => {
    return Object.keys(this._storyIndex.entries).includes(storyId);
  };

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
          value = await this._storage.getItem(RN_STORYBOOK_STORAGE_KEY);

          this._asyncStorageStoryId = value;
        }

        const exists = value && this._storyIdExists(value);

        if (!exists) console.log('Storybook: could not find persisted story');

        return { storySpecifier: exists ? value : '*', viewMode: 'story' };
      } catch (e) {
        console.warn('storybook-log: error reading from async storage', e);
      }
    }

    return { storySpecifier: '*', viewMode: 'story' };
  };

  _getHost = (params: Partial<Params> = {}) => {
    if (params.host) {
      return params.host;
    }

    if (globalThis.STORYBOOK_WEBSOCKET?.host) {
      return globalThis.STORYBOOK_WEBSOCKET.host;
    }

    return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  };

  __getPort = (params: Partial<Params> = {}) => {
    if (params.port) {
      return params.port;
    }

    if (globalThis.STORYBOOK_WEBSOCKET?.port) {
      return globalThis.STORYBOOK_WEBSOCKET.port;
    }

    return 7007;
  };

  _isSecureConnection = (params: Partial<Params> = {}) => {
    if (typeof params.secured === 'boolean') {
      return params.secured;
    }

    return globalThis.STORYBOOK_WEBSOCKET?.secured ?? false;
  };

  _getServerChannel = (params: Partial<Params> = {}) => {
    const host = this._getHost(params);

    const port = `:${this.__getPort(params)}`;

    const query = params.query || '';

    const websocketType = this._isSecureConnection(params) ? 'wss' : 'ws';

    const url = `${websocketType}://${host}${port}/${query}`;

    const channel = new Channel({
      async: true,
      transport: new WebsocketTransport({
        url,
        onError: (e) => {
          console.log(`WebsocketTransport error ${JSON.stringify(e)}`);
        },
      }),
    });
    patchChannelForRN(channel);

    return channel;
  };

  createPreparedStoryMapping = async () => {
    await this._preview.ready().then(() =>
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
      CustomUIComponent,
      hasStoryWrapper: storyViewWrapper = true,
    } = params;

    const getFullUI = (enabled: boolean): SBUI => {
      if (enabled) {
        try {
          const { FullUI } = require('@storybook/react-native-ui');
          return FullUI;
        } catch (error) {
          console.warn('storybook-log: error loading UI', error);
        }
      }

      const PlaceholderUI: SBUI = ({ children }) => children;
      return PlaceholderUI;
    };

    const FullUI: SBUI = getFullUI(onDeviceUI && !CustomUIComponent);

    this._storage = storage;

    const initialStory = this._getInitialStory(params);

    if (enableWebsockets) {
      const channel = this._getServerChannel(params);
      managerAddons.setChannel(channel);
      previewAddons.setChannel(channel);
      this._channel = channel;
      // @ts-ignore FIXME
      this._preview.channel = channel;
      this._preview.setupListeners();
      channel.emit(CHANNEL_CREATED);
      this._preview.ready().then(() => this._preview.onStoryIndexChanged());
    }

    this._channel.on(RN_STORYBOOK_EVENTS.RN_GET_INDEX, () => {
      // TODO: define response payload
      this._channel.emit(RN_STORYBOOK_EVENTS.RN_GET_INDEX_RESPONSE, { index: this._storyIndex });
    });

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

    const self = this;

    // eslint-disable-next-line react/display-name
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

      // deep link handling
      useEffect(() => {
        const listener = Linking.addEventListener('url', ({ url }) => {
          if (typeof url === 'string') {
            const urlObj = new URL(url);
            const storyId = urlObj.searchParams.get(STORYBOOK_STORY_ID_PARAM);

            const hasStoryId = storyId && typeof storyId === 'string';
            const storyExists = hasStoryId && self._storyIdExists(storyId);

            if (storyExists && self._ready) {
              console.log(`STORYBOOK: Linking event received, navigating to story: ${storyId}`);
              self._channel.emit(SET_CURRENT_STORY, { storyId });
            }

            if (hasStoryId && !storyExists) {
              console.log(
                `STORYBOOK: Linking event received, but story does not exist: ${storyId}`
              );
            }
          }
        });

        return () => {
          listener.remove();
        };
      }, []);

      useEffect(() => {
        self
          .createPreparedStoryMapping()
          .then(() => {
            self._ready = true;
            setReady(true);
            return Linking.getInitialURL()
              .then((url) => {
                if (url && typeof url === 'string') {
                  const urlObj = new URL(url);
                  const storyId = urlObj.searchParams.get(STORYBOOK_STORY_ID_PARAM);

                  const hasStoryId = storyId && typeof storyId === 'string';
                  const storyExists = hasStoryId && self._storyIdExists(storyId);

                  if (hasStoryId && !storyExists) {
                    console.log(
                      `STORYBOOK: Initial Linking event received, but story does not exist: ${storyId}`
                    );
                  }

                  if (storyExists) {
                    return storyId;
                  } else {
                    return null;
                  }
                }
              })
              .then((initialStoryIdFromUrl) => {
                return initialStory.then((st) => {
                  self._preview.selectionStore.selectionSpecifier = st;

                  if (initialStoryIdFromUrl) {
                    console.log(
                      `STORYBOOK: Setting initial story from Linking event, storyId: ${initialStoryIdFromUrl}`
                    );

                    self._preview.selectionStore.selectionSpecifier = {
                      storySpecifier: initialStoryIdFromUrl,
                      viewMode: 'story',
                    };
                  }

                  self._preview.selectSpecifiedStory();
                });
              });
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

          if (shouldPersistSelection && !!self._storage) {
            self._storage.setItem(RN_STORYBOOK_STORAGE_KEY, newStory.id).catch((e) => {
              console.warn('storybook-log: error writing to async storage', e);
            });
          }
        };

        self._forceRerender = () => forceUpdate();

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const storyHash: API_IndexHash = useMemo(() => {
        if (!ready) {
          return {};
        }

        return transformStoryIndexToStoriesHash(self._storyIndex, {
          docsOptions: { docsMode: false, defaultName: '' },
          filters: {},
          allStatuses: {},
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

      const storyBackgroundColor = globalThis.FEATURES?.ondeviceBackgrounds
        ? resolveStoryBackgroundColor(story)
        : undefined;

      if (onDeviceUI) {
        if (CustomUIComponent) {
          return (
            <CustomUIComponent
              story={story}
              storyHash={storyHash}
              setStory={(newStoryId) =>
                self._channel.emit(SET_CURRENT_STORY, { storyId: newStoryId })
              }
              storage={storage}
              theme={appliedTheme as Theme}
              storyBackgroundColor={storyBackgroundColor}
            >
              <StoryView
                useWrapper={storyViewWrapper}
                storyBackgroundColor={storyBackgroundColor}
              />
            </CustomUIComponent>
          );
        }

        return (
          <FullUI
            storage={storage}
            theme={appliedTheme as Theme}
            storyHash={storyHash}
            story={story}
            setStory={(newStoryId) =>
              self._channel.emit(SET_CURRENT_STORY, { storyId: newStoryId })
            }
            storyBackgroundColor={storyBackgroundColor}
          >
            <StoryView useWrapper={storyViewWrapper} storyBackgroundColor={storyBackgroundColor} />
          </FullUI>
        );
      } else {
        return (
          <StoryView useWrapper={storyViewWrapper} storyBackgroundColor={storyBackgroundColor} />
        );
      }
    };
  };
}
