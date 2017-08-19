import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({ sidebarAnimations: false, }),

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
