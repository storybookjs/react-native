import * as storybook from '@kadira/storybook';

const req = require.context('./components/', true, /stories\.js$/)

const loadStories = () =>
  req.keys().forEach(req);


storybook.configure(loadStories, module)
