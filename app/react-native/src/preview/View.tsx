import React, { useEffect, useState, useReducer } from 'react';
// import { Text } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoryIndex, SelectionSpecifier } from '@storybook/store';
import { StoryContext, toId } from '@storybook/csf';
import { addons } from '@storybook/addons';
// import Channel from '@storybook/channels';
// import { Loadable } from '@storybook/core-client';
// import Events from '@storybook/core-events';
// import { toId, Globals, Args } from '@storybook/csf';
import { ThemeProvider } from 'emotion-theming';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnDeviceUI from './components/OnDeviceUI';
import { theme } from './components/Shared/theme';
import type { ReactNativeFramework } from '../types/types-6.0';
import { PreviewWeb } from '@storybook/preview-web';

// const STORAGE_KEY = 'lastOpenedStory';

// interface AsyncStorage {
//   getItem: (key: string) => Promise<string | null>;
//   setItem: (key: string, value: string) => Promise<void>;
// }

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

export class View {
  _storyIndex: StoryIndex;
  _setStory: (story: StoryContext<ReactNativeFramework>) => void = () => {};
  _forceRerender: () => void;
  _ready: boolean = false;
  _preview: PreviewWeb<ReactNativeFramework>;
  // _intialStory: StoryContext<ReactNativeFramework>;
  constructor(preview: PreviewWeb<ReactNativeFramework>) {
    this._preview = preview;
  }
  _getInitialStory = ({
    initialSelection /* , shouldPersistSelection */,
  }: Partial<Params> = {}): SelectionSpecifier => {
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

    // if (!shouldPersistSelection) {
    return { storySpecifier: '*', viewMode: 'story' };
    // }
  };
  getStorybookUI = (params: Partial<Params> = {}) => {
    // const channel = new Channel({ async: true });
    // addons.setChannel(channel);

    // const { initialSelection, shouldPersistSelection = true } = params;
    const initialStory = this._getInitialStory(params);
    console.log(initialStory);
    // this._setInitialStory(initialSelection, shouldPersistSelection);

    // this._channel.on(Events.SET_CURRENT_STORY, (d: { storyId: string }) => {
    //   this._selectStoryEvent(d, shouldPersistSelection);
    // });
    addons.loadAddons({
      store: () => ({
        fromId: (id) =>
          this._preview.storyStore.getStoryContext(this._preview.storyStore.fromId(id)),
        getSelection: () => {
          return this._preview.currentSelection;
        },
        _channel: this._preview.channel,
        // resetStoryArgs: () => {},
      }),
    });

    // eslint-disable-next-line consistent-this
    const self = this;

    const appliedTheme = { ...theme, ...params.theme };
    return () => {
      // const [ready, setReady] = useState(false);

      const [context, setContext] = useState<StoryContext<ReactNativeFramework>>();
      const [, forceUpdate] = useReducer((x) => x + 1, 0);
      useEffect(() => {
        // self._setReady = setReady;
        self._setStory = (newStory: StoryContext<ReactNativeFramework>) => {
          setContext(newStory);
        };
        self._forceRerender = () => forceUpdate();

        self._preview.urlStore.selectionSpecifier = initialStory;
        self._preview.selectSpecifiedStory();
        console.log('render');
      }, []);

      return (
        <SafeAreaProvider>
          <ThemeProvider theme={appliedTheme}>
            <OnDeviceUI
              context={context}
              storyIndex={self._storyIndex}
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
  // _storyStore: StoryStore<ReactFramework>;

  // _getStoryIndex?: () => StoryIndex;

  // _storyId: StoryId;

  // _setReady: (ready: boolean) => void;

  // _addons: any;

  // _channel: Channel;

  // // _decorators: any[];

  // _asyncStorageStoryId: string;

  // configure: (loadable: Loadable, m: NodeModule) => void;

  // constructor({ storyStore }: { storyStore: StoryStore<ReactFramework> }) {
  //   // this._decorators = [];
  //   this._storyStore = storyStore;
  // }

  // initialize({
  //   getStoryIndex,
  // }: {
  //   // In the case of the v6 store, we can only get the index from the facade *after*
  //   // getProjectAnnotations has been run, thus this slightly awkward approach
  //   getStoryIndex?: () => StoryIndex;
  // }) {
  //   this._channel = addons.getChannel();
  //   this._storyIndex = getStoryIndex();
  //   this._storyStore
  //     .initialize({
  //       storyIndex: this._storyIndex,
  //       importFn: () => Promise.resolve({}),
  //       cache: true,
  //     })
  //     .then(() => {
  //       console.log('ready will be set');
  //       this._ready = true;
  //       // this._setReady(true);
  //     });

  //   this.setupListeners();
  // }

  // setupListeners() {
  //   this._channel.on(Events.SET_CURRENT_STORY, this.onSetCurrentStory.bind(this));
  //   this._channel.on(Events.UPDATE_GLOBALS, this.onUpdateGlobals.bind(this));
  //   this._channel.on(Events.UPDATE_STORY_ARGS, this.onUpdateArgs.bind(this));
  //   this._channel.on(Events.RESET_STORY_ARGS, this.onResetArgs.bind(this));
  //   this._channel.on(Events.FORCE_RE_RENDER, this.onForceReRender.bind(this));
  //   this._channel.on(Events.FORCE_REMOUNT, this.onForceRemount.bind(this));
  // }

  // onSetCurrentStory(selection: Selection) {
  //   console.log('onSetCurrentStory', { selection });
  //   this._channel.emit(Events.CURRENT_STORY_WAS_SET, selection);
  //   this._setStory({ story: selection.story });
  // }

  // async onUpdateGlobals({ globals }: { globals: Globals }) {
  //   this._storyStore.globals.update(globals);

  //   this._forceRerender();

  //   this._channel.emit(Events.GLOBALS_UPDATED, {
  //     globals: this._storyStore.globals.get(),
  //     initialGlobals: this._storyStore.globals.initialGlobals,
  //   });
  // }

  // async onUpdateArgs({ storyId, updatedArgs }: { storyId: StoryId; updatedArgs: Args }) {
  //   this._storyStore.args.update(storyId, updatedArgs);

  //   this._forceRerender();

  //   this._channel.emit(Events.STORY_ARGS_UPDATED, {
  //     storyId,
  //     args: this._storyStore.args.get(storyId),
  //   });
  // }

  // async onResetArgs({ storyId, argNames }: { storyId: string; argNames?: string[] }) {
  //   const { initialArgs } = this._storyStore.fromId(storyId);

  //   const argNamesToReset = argNames || Object.keys(this._storyStore.args.get(storyId));
  //   const updatedArgs = argNamesToReset.reduce((acc, argName) => {
  //     acc[argName] = initialArgs[argName];
  //     return acc;
  //   }, {} as Partial<Args>);

  //   await this.onUpdateArgs({ storyId, updatedArgs });
  // }

  // // ForceReRender does not include a story id, so we simply must
  // // re-render all stories in case they are relevant
  // async onForceReRender() {
  //   this._forceRerender();
  // }

  // async onForceRemount({ storyId }: { storyId: StoryId }) {
  //   console.log('onForceRemount', { storyId });
  //   this._forceRerender();
  // }

  // // This happens when a glob gets HMR-ed
  // async onStoriesChanged({ storyIndex }: { storyIndex?: StoryIndex }) {
  //   console.log({ storyIndex });
  // }

  // _setInitialStory = async (initialSelection?: InitialSelection, shouldPersistSelection = true) => {
  //   const story = await this._getInitialStory(initialSelection, shouldPersistSelection);

  //   if (story) {
  //     this._selectStory(story);
  //   }
  // };

  // _getInitialStory = async (initialSelection?: InitialSelection, shouldPersistSelection = true) => {
  //   let story: string = null;
  //   const initialSelectionId =
  //     initialSelection === undefined
  //       ? undefined
  //       : typeof initialSelection === 'string'
  //       ? initialSelection
  //       : toId(initialSelection.kind, initialSelection.name);

  //   if (initialSelectionId !== undefined && this._checkStory(initialSelectionId)) {
  //     story = initialSelectionId;
  //   } else if (shouldPersistSelection) {
  //     try {
  //       let value = this._asyncStorageStoryId;
  //       if (!value) {
  //         value = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
  //         this._asyncStorageStoryId = value;
  //       }

  //       if (this._checkStory(value)) {
  //         story = value;
  //       }
  //     } catch (e) {
  //       //
  //     }
  //   }

  //   if (story) {
  //     return this._getStory(story);
  //   }

  //   await this._storyStore.cacheAllCSFFiles();
  //   const stories = this._storyStore.raw();
  //   if (stories && stories.length) {
  //     return this._getStory(stories[0].id);
  //   }

  //   return null;
  // };

  // _getStory(storyId: string) {
  //   return this._storyStore.fromId(storyId);
  // }

  // _selectStoryEvent({ storyId }: { storyId: string }, shouldPersistSelection) {
  //   if (storyId) {
  //     if (shouldPersistSelection) {
  //       AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storyId)).catch(() => {});
  //     }

  //     const story = this._getStory(storyId);
  //     this._selectStory(story);
  //   }
  // }

  // _selectStory(story: any) {
  //   this._storyId = story.id;
  //   this._channel.emit(Events.SELECT_STORY, story);
  // }

  // _checkStory(storyId: string) {
  //   if (!storyId) {
  //     return null;
  //   }

  //   const story = this._getStory(storyId);

  //   if (story === null || story.storyFn === null) {
  //     return null;
  //   }

  //   return story;
  // }
}
