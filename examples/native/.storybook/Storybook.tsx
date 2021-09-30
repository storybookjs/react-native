import { getStorybookUI } from '@storybook/react-native';

import './storybook.requires';

const StorybookUIRoot = getStorybookUI({
  // initialSelection: { kind: 'Radio control', name: 'Basic' },
  // shouldPersistSelection: false,
});

export default StorybookUIRoot;
