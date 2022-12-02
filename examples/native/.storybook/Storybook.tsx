import React from 'react';
import { getStorybookUI } from '@storybook/react-native';

import './doctools';
import './storybook.requires';
// import { SafeAreaView } from 'react-native';

const StorybookUIRoot = getStorybookUI({
  // initialSelection: { kind: 'TextInput', name: 'Basic' },
  shouldPersistSelection: true,
  // onDeviceUI: false,
  // enableWebsockets: true,
});

export default () => (
  // <SafeAreaView>
  <StorybookUIRoot />
  // </SafeAreaView>
);
