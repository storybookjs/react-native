// @ts-ignore
import { getStorybookUI } from '@storybook/react-native';
import './storybook.requires';
const StorybookUIRoot = getStorybookUI({
  asyncStorage: null,
});

export default StorybookUIRoot;
