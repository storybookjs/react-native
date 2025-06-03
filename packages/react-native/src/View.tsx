import { StoryContext, toId } from '@storybook/csf';
import type { ReactRenderer } from '@storybook/react';
import { Theme, darkTheme, theme } from '@storybook/react-native-theming';
import { type SBUI, transformStoryIndexToStoriesHash } from '@storybook/react-native-ui-common';
import { Channel, WebsocketTransport } from 'storybook/internal/channels';
import { CHANNEL_CREATED, SET_CURRENT_STORY } from 'storybook/internal/core-events';
import { addons as managerAddons } from 'storybook/internal/manager-api';
import { PreviewWithSelection, addons as previewAddons } from 'storybook/internal/preview-api';
import type { API_IndexHash, PreparedStory, StoryId, StoryIndex } from 'storybook/internal/types';

import dedent from 'dedent';
import deepmerge from 'deepmerge';
import { useEffect, useMemo, useReducer, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  View as RNView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import StoryView from './components/StoryView';
import { useSetStoryContext, useStoryContext } from './hooks';
import getHost from './rn-host-detect';

const STORAGE_KEY = 'lastOpenedStory';

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
  enableWebsockets?: boolean;
  query?: string;
  host?: string;
  port?: number;
  secured?: boolean;
  initialSelection?: InitialSelection;
  shouldPersistSelection?: boolean;
  theme: ThemePartial;
  storage?: Storage;
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
          value = await this._storage.getItem(STORAGE_KEY);

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
            const storyId = urlObj.searchParams.get('STORYBOOK_STORY_ID');

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
                  const storyId = urlObj.searchParams.get('STORYBOOK_STORY_ID');

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
            self._storage.setItem(STORAGE_KEY, newStory.id).catch((e) => {
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
            >
              <StoryView />
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
          >
            <StoryView />
          </FullUI>
        );
      } else {
        return <StoryView />;
      }
    };
  };
}
