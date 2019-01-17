import { configure, addParameters } from '@storybook/svelte';

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

function loadStories() {
  require('../src/stories');

  const req = require.context('../src/stories', true, /\.stories\.js$/);

  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
