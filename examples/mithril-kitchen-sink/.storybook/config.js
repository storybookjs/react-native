import { configure, addParameters } from '@storybook/mithril';

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

function loadStories() {
  const req = require.context('../src/stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
