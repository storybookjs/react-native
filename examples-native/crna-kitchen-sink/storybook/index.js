import { getStorybookUI, configure } from '@storybook/react-native';
import './rn-addons';

configure(() => {
  // eslint-disable-next-line global-require
  require('./stories');
}, module);

const StorybookUIRoot = getStorybookUI();
export default StorybookUIRoot;
