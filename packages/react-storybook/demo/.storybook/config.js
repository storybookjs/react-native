import { configure } from '@storybook/storybook';

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
