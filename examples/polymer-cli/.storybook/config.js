/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure } from '@storybook/polymer';

function loadStories() {
  require('../src/stories/index.stories');
  require('../src/stories/advanced.stories');
}

configure(loadStories, module);
