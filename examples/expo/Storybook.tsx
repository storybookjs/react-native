/* eslint-disable global-require */
import { getStorybookUI, configure } from '@storybook/react-native';

configure(() => {
  // require('../components/Button/Button.stories');

  require('./storybook.requires');
}, module);

const StorybookUIRoot = getStorybookUI({
  asyncStorage: null,
});

export default StorybookUIRoot;
