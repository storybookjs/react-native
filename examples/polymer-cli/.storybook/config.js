import { configure } from '@storybook/polymer';

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
