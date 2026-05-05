// This file is the app's bundle entry when Storybook is enabled.
// `withStorybook` swaps the resolver from the project's `index.js` to this
// file, so it must register a root component itself. See ../metro.config.js
// and ../README.md for the full picture.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerRootComponent } from 'expo';

import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  enableWebsockets: true,
});

registerRootComponent(StorybookUIRoot);
