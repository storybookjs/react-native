import { configure, addParameters } from '@storybook/html';

addParameters({
  html: {
    preventForcedRender: false, // default
  },
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  // Make welcome story default
  require('../stories/index.stories');
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
