import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import { setOptions } from '@storybook/addon-options';

// import stories
configure(() => {
  // eslint-disable-next-line global-require
  require('./stories');
}, module);

const StorybookUI = getStorybookUI({ port: 7007, host: 'localhost' });

setTimeout(
  () =>
    setOptions({
      name: 'React Native Vanilla',
    }),
  100
);

AppRegistry.registerComponent('ReactNativeVanilla', () => StorybookUI);

export { StorybookUI as default };
