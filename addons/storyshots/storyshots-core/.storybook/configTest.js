import { configure } from '@storybook/react';

const req = require.context('../stories/required_with_context', false, /\.stories\.js$/);

const loadStories = () => {
  const result = req.keys().map(filename => req(filename));
  // eslint-disable-next-line global-require
  require('../stories/directly_required');
  return result;
};

configure(loadStories, module);
