// IMPORTANT
// ---------
// This is an auto generated file with React CDK.
// Do not modify this file.

import { configure, setAddon } from '@kadira/storybook';
import { addWithKnobs } from '../src';

setAddon({addWithKnobs});

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
