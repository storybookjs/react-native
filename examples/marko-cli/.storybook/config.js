import { configure, addParameters } from '@storybook/marko';

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

function loadStories() {
  // put welcome screen at the top of the list so it's the first one displayed
  // require('../src/stories/welcome');

  // automatically import all story js files that end with *.stories.js
  const req = require.context('../src/stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
