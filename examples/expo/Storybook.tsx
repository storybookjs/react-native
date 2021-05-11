// @ts-ignore
import { getStorybookUI, configure } from './storybook.requires';

configure(() => {
  // require('../components/Button/Button.stories');
}, module);

const StorybookUIRoot = getStorybookUI({
  asyncStorage: null,
});

export default StorybookUIRoot;
