import { configure } from '@storybook/react';

const req = require.context('../stories/required_with_context', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
  // eslint-disable-next-line global-require
  require('../stories/directly_required');
}

configure(loadStories, module);
