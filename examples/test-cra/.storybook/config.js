import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setTimeout(
  () => setOptions({ sidebarAnimations: false, }),
  100
);

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
