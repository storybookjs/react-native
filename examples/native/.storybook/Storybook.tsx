import React from 'react';
import { getStorybookUI } from '@storybook/react-native';

import './doctools';
import './storybook.requires';

const StorybookUIRoot = getStorybookUI({
  // initialSelection: { kind: 'TextInput', name: 'Basic' },
  shouldPersistSelection: true,
  onDeviceUI: true,
});

export default () => <StorybookUIRoot />;
