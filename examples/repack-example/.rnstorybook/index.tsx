import AsyncStorage from '@react-native-async-storage/async-storage';
import { LiteUI } from '@storybook/react-native-ui-lite';
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  enableWebsockets: true,
  CustomUIComponent: LiteUI,
});

export default StorybookUIRoot;
