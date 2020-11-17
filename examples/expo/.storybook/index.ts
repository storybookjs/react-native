import { getStorybookUI, configure, addDecorator, addParameters } from '@storybook/react-native';

configure(() => {
  // eslint-disable-next-line global-require
  require('../components/Button/Button.stories');
}, module);
const StorybookUIRoot = getStorybookUI({
  asyncStorage: null,
});
export default StorybookUIRoot;
