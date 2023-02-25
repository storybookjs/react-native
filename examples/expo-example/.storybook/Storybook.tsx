import React from 'react';
import { getStorybookUI } from '@storybook/react-native';
// import { SafeAreaView } from 'react-native';

import './doctools';
import './storybook.requires';

const StorybookUIRoot = getStorybookUI({
  // initialSelection: { kind: 'TextInput', name: 'Basic' },
  shouldPersistSelection: true,
  // onDeviceUI: false,
  // enableWebsockets: true,
});

export default () => (
  // <SafeAreaView style={{ flex: 1 }}>
  <StorybookUIRoot />
  // </SafeAreaView>
);
