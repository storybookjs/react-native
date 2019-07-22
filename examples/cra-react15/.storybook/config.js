import { load, addParameters } from '@storybook/react';
import { create } from '@storybook/theming/create';

addParameters({
  options: {
    theme: create({ colorPrimary: 'hotpink', colorSecondary: 'orangered' }),
  },
});

// test loading function
const loadFn = () => {
  // place welcome first, test storiesof files
  require('../src/stories/welcome.stories');

  // test mixtures of storiesof & module files
  const req = require.context('../src/stories', true, /\.stories\.js$/);
  return req.keys().map(fname => req(fname));
};

load(loadFn, module);
