/* eslint-disable global-require */
import { configure, addParameters, addDecorator } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import addCssWarning from '../src/cssWarning';

addDecorator(withA11y);
addCssWarning();

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

function loadStories() {
  // put welcome screen at the top of the list so it's the first one displayed
  require('../src/stories');

  // automatically import all story ts files that end with *.stories.ts
  const req = require.context('../src/stories', true, /\.stories\.ts$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
