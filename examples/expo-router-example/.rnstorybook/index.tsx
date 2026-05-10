// This file is the app's bundle entry when Storybook is enabled.
// `withStorybook` swaps the resolver from the project's `index.js` to this
// file, so it must register a root component itself. See ../metro.config.js
// and ../README.md for the full picture.
import Storage from 'expo-sqlite/kv-store';
import { registerRootComponent } from 'expo';
import { LiteUI } from '@storybook/react-native-ui-lite';
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: (s) => Storage.getItem(s),
    setItem: (s, v) => Storage.setItem(s, v),
  },
  enableWebsockets: true,
  CustomUIComponent: LiteUI,
});

registerRootComponent(StorybookUIRoot);
