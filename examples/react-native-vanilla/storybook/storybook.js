import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
import { getStorybookUI, configure } from '@storybook/react-native';
import { setOptions } from '@storybook/addon-options';

// import stories
configure(() => {
  // eslint-disable-next-line global-require
  require('./stories');
}, module);

const StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true });

setTimeout(
  () =>
    setOptions({
      name: 'React Native Vanilla',
    }),
  100
);

// react-native hot module loader must take in a Class - https://github.com/facebook/react-native/issues/10991
// eslint-disable-next-line react/prefer-stateless-function
class StorybookUIHMRRoot extends Component {
  render() {
    return <StorybookUIRoot />;
  }
}

AppRegistry.registerComponent('ReactNativeVanilla', () => StorybookUIHMRRoot);
export default StorybookUIHMRRoot;
