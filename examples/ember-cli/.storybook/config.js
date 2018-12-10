import { configure, addParameters } from '@storybook/ember';

addParameters({
  options: {
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
  },
});

function loadStories() {
  require('../stories/index.stories');

  const req = require.context('../stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
