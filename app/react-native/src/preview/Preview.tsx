import React, { useEffect, useState, useReducer } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoryId, StoryStore, StoryIndex, Selection } from '@storybook/store';
import { addons } from '@storybook/addons';
import Channel from '@storybook/channels';
import { Loadable } from '@storybook/core-client';
import Events from '@storybook/core-events';
import { toId, Globals, Args } from '@storybook/csf';
import { ThemeProvider } from 'emotion-theming';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnDeviceUI from './components/OnDeviceUI';
import { theme } from './components/Shared/theme';
import type { ReactFramework } from '../types-6.0';

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

export class Preview {
  _storyStore: StoryStore<ReactFramework>;

  _getStoryIndex?: () => StoryIndex;

  _storyId: StoryId;

  _setStory: ({ id }: { id: string }) => void;
  _forceRerender: () => void;

  _addons: any;

  _channel: Channel;

  // _decorators: any[];

  _asyncStorageStoryId: string;

  configure: (loadable: Loadable, m: NodeModule) => void;

  constructor() {
    this._channel = addons.getChannel();
    // this._decorators = [];
  }

  initialize({
    getStoryIndex,
  }: {
    // In the case of the v6 store, we can only get the index from the facade *after*
    // getProjectAnnotations has been run, thus this slightly awkward approach
    getStoryIndex?: () => StoryIndex;
  }) {
    this._getStoryIndex = getStoryIndex;
    this.setupListeners();
  }

  setupListeners() {
    this._channel.on(Events.SET_CURRENT_STORY, this.onSetCurrentStory.bind(this));
    this._channel.on(Events.UPDATE_GLOBALS, this.onUpdateGlobals.bind(this));
    this._channel.on(Events.UPDATE_STORY_ARGS, this.onUpdateArgs.bind(this));
    this._channel.on(Events.RESET_STORY_ARGS, this.onResetArgs.bind(this));
    this._channel.on(Events.FORCE_RE_RENDER, this.onForceReRender.bind(this));
    this._channel.on(Events.FORCE_REMOUNT, this.onForceRemount.bind(this));
  }

  onSetCurrentStory(selection: Selection) {
    console.log('onSetCurrentStory', { selection });
    this._channel.emit(Events.CURRENT_STORY_WAS_SET, selection);
    this._setStory({ id: selection.storyId });
  }

  async onUpdateGlobals({ globals }: { globals: Globals }) {
    this._storyStore.globals.update(globals);

    this._forceRerender();

    this._channel.emit(Events.GLOBALS_UPDATED, {
      globals: this._storyStore.globals.get(),
      initialGlobals: this._storyStore.globals.initialGlobals,
    });
  }

  async onUpdateArgs({ storyId, updatedArgs }: { storyId: StoryId; updatedArgs: Args }) {
    this._storyStore.args.update(storyId, updatedArgs);

    this._forceRerender();

    this._channel.emit(Events.STORY_ARGS_UPDATED, {
      storyId,
      args: this._storyStore.args.get(storyId),
    });
  }

  async onResetArgs({ storyId, argNames }: { storyId: string; argNames?: string[] }) {
    const { initialArgs } = this._storyStore.fromId(storyId);

    const argNamesToReset = argNames || Object.keys(this._storyStore.args.get(storyId));
    const updatedArgs = argNamesToReset.reduce((acc, argName) => {
      acc[argName] = initialArgs[argName];
      return acc;
    }, {} as Partial<Args>);

    await this.onUpdateArgs({ storyId, updatedArgs });
  }

  // ForceReRender does not include a story id, so we simply must
  // re-render all stories in case they are relevant
  async onForceReRender() {
    this._forceRerender();
  }

  async onForceRemount({ storyId }: { storyId: StoryId }) {
    console.log('onForceRemount', { storyId });
    this._forceRerender();
  }

  // This happens when a glob gets HMR-ed
  async onStoriesChanged({ storyIndex }: { storyIndex?: StoryIndex }) {
    console.log({ storyIndex });
  }

  getStorybookUI = (params: Partial<Params> = {}) => {
    const channel = new Channel({ async: true });
    addons.setChannel(channel);

    const { initialSelection, shouldPersistSelection = true } = params;
    this._setInitialStory(initialSelection, shouldPersistSelection);

    // this._channel.on(Events.SET_CURRENT_STORY, (d: { storyId: string }) => {
    //   this._selectStoryEvent(d, shouldPersistSelection);
    // });
    // addons.loadAddons(this._clientApi);

    // eslint-disable-next-line consistent-this
    const self = this;
    let storyIndex;

    const appliedTheme = { ...theme, ...params.theme };
    return () => {
      const [storyId, setStoryId] = useState(this._storyId || '');
      const [, forceUpdate] = useReducer((x) => x + 1, 0);
      useEffect(() => {
        self._setStory = ({ id: newStoryId }: { id: string }) => setStoryId(newStoryId);
        self._forceRerender = () => forceUpdate();

        self._storyStore = new StoryStore();
        storyIndex = self._getStoryIndex();
        self._storyStore
          .initialize({
            storyIndex,
            importFn: () => Promise.resolve({}),
            cache: true,
          })
          .then(() => self._channel.emit(Events.FORCE_RE_RENDER));
      }, []);

      if (!storyIndex || !self._storyStore) {
        return <Text>Loading</Text>;
      }

      const story = self._storyStore.fromId(storyId);

      return (
        <SafeAreaProvider>
          <ThemeProvider theme={appliedTheme}>
            <OnDeviceUI
              story={story}
              storyIndex={storyIndex}
              isUIHidden={params.isUIHidden}
              tabOpen={params.tabOpen}
              shouldDisableKeyboardAvoidingView={params.shouldDisableKeyboardAvoidingView}
              keyboardAvoidingViewVerticalOffset={params.keyboardAvoidingViewVerticalOffset}
            />
          </ThemeProvider>
        </SafeAreaProvider>
      );
    };
  };

  _setInitialStory = async (initialSelection?: InitialSelection, shouldPersistSelection = true) => {
    const story = await this._getInitialStory(initialSelection, shouldPersistSelection);

    if (story) {
      this._selectStory(story);
    }
  };

  _getInitialStory = async (initialSelection?: InitialSelection, shouldPersistSelection = true) => {
    let story: string = null;
    const initialSelectionId =
      initialSelection === undefined
        ? undefined
        : typeof initialSelection === 'string'
        ? initialSelection
        : toId(initialSelection.kind, initialSelection.name);

    if (initialSelectionId !== undefined && this._checkStory(initialSelectionId)) {
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
    this._storyId = story.id;
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
