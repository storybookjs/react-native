import React, { useEffect, useState, useReducer } from 'react';
// import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export class View {
  _storyIndex: StoryIndex;
  _setStory: (story: StoryContext<ReactNativeFramework>) => void = () => {};
  _forceRerender: () => void;
  _ready: boolean = false;
  _preview: PreviewWeb<ReactNativeFramework>;
  _asyncStorageStoryId: string;

  constructor(preview: PreviewWeb<ReactNativeFramework>) {
    this._preview = preview;
  }
  _getInitialStory = async ({
    initialSelection,
    shouldPersistSelection,
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
          value = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
          this._asyncStorageStoryId = value;
        }
        return { storySpecifier: value, viewMode: 'story' };
      } catch (e) {
        console.log('storybook-log: error reading from async storage');
      }
    }

    return { storySpecifier: '*', viewMode: 'story' };
  };
  getStorybookUI = (params: Partial<Params> = {}) => {
    // const { initialSelection, shouldPersistSelection = true } = params;
    const initialStory = this._getInitialStory(params);

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
      const [context, setContext] = useState<StoryContext<ReactNativeFramework>>();
      const [, forceUpdate] = useReducer((x) => x + 1, 0);
      useEffect(() => {
        self._setStory = (newStory: StoryContext<ReactNativeFramework>) => {
          setContext(newStory);
        };
        self._forceRerender = () => forceUpdate();
        initialStory.then((story) => {
          self._preview.urlStore.selectionSpecifier = story;
          self._preview.selectSpecifiedStory();
        });
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

  // _selectStoryEvent({ storyId }: { storyId: string }, shouldPersistSelection) {
  //   if (storyId) {
  //     if (shouldPersistSelection) {
  //       AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storyId)).catch(() => {});
  //     }

  //     const story = this._getStory(storyId);
  //     this._selectStory(story);
  //   }
  // }
}
