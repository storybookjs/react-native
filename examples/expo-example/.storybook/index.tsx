import React from 'react';
// import { getStorybookUI } from '@storybook/react-native';
// import { SafeAreaView } from 'react-native';
// import './doctools';
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  // initialSelection: { kind: 'TextInput', name: 'Basic' },
  shouldPersistSelection: true,
  // isUIHidden: true,
  // isSplitPanelVisible: true,

  // onDeviceUI: false,
  enableWebsockets: true,
  // theme: {
  //   storyList: {
  //     search: {
  //       borderColor: 'red',
  //       borderWidth: 3,
  //     },
  //   },
  //   tabs: {
  //     activeBackgroundColor: 'yellow',
  //   },
  // },
});

export default () => (
  // <SafeAreaView style={{ flex: 1 }}>
  <StorybookUIRoot />
  // </SafeAreaView>
);
