/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure } from '@storybook/angular';

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
