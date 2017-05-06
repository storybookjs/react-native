import { configure } from '@storybook/storybook';

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
