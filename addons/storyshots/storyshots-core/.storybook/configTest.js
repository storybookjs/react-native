import { configure } from '@storybook/react';

const req = require.context('../stories/required_with_context', false, /\.stories\.js$/);

const loadStories = () => [
  ...req.keys().map(filename => req(filename)),
  // eslint-disable-next-line global-require
  require('../stories/directly_required'),
];

configure(loadStories, module);
