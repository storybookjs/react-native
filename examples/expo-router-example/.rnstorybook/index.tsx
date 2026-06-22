// This file is the app's bundle entry when Storybook is enabled.
// `withStorybook` swaps the resolver from the project's `index.js` to this
// file, so it must register a root component itself. See ../metro.config.js
// and ../README.md for the full picture.
import Storage from 'expo-sqlite/kv-store';
import { registerRootComponent } from 'expo';
import { LiteUI } from '@storybook/react-native-ui-lite';
import { view } from './storybook.requires';
import { Platform } from 'react-native';

const storage =
  Platform.OS === 'web'
    ? {
        getItem: (s: string) => localStorage.getItem(s),
        setItem: (s: string, v: string) => localStorage.setItem(s, v),
      }
    : {
        getItem: (s: string) => Storage.getItem(s),
        setItem: (s: string, v: string) => Storage.setItem(s, v),
      };

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage,
  enableWebsockets: true,
  CustomUIComponent: LiteUI,
});

registerRootComponent(StorybookUIRoot);
