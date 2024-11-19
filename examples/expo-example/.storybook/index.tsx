import { view } from './storybook.requires';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  enableWebsockets: false,
  // host: '192.x.x.x',
  // port: 7007,

  // initialSelection: { kind: 'TextInput', name: 'Basic' },
  // onDeviceUI: false,
  // host: '192.168.1.69',
  // theme: {
  //   brand: {
  //     image: {
  //       uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png',
  //       width: 25,
  //       height: 25,
  //     },
  //   },
  // },
});

export default StorybookUIRoot;
