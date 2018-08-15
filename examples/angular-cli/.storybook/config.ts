import { configure } from '@storybook/angular';
import { setOptions } from '@storybook/addon-options';
import addCssWarning from '../src/cssWarning';

const path =require('path');
const rc = require('require-context');

addCssWarning();

setOptions({
  hierarchyRootSeparator: /\|/,
});

const pathToStories = path.join(__dirname, '../src/stories');

function loadStories() {
  // put welcome screen at the top of the list so it's the first one displayed
  require('../src/stories');

  // automatically import all story ts files that end with *.stories.ts
  const req = rc(pathToStories, true, /\.stories\.ts$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
