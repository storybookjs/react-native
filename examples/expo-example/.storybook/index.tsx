import { view } from './storybook.requires';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  enableWebsockets: true,

  // initialSelection: { kind: 'TextInput', name: 'Basic' },
  // isUIHidden: true,
  // isSplitPanelVisible: true,
  // onDeviceUI: false,
  // host: '192.168.1.69',
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

export default StorybookUIRoot;
