import * as storybook from '@storybook/react';

const req = require.context('./components/', true, /stories\.js$/)

const loadStories = () =>
  req.keys().forEach(req);


storybook.configure(loadStories, module)
