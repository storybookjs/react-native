/** @jsx h */
import { addParameters, configure } from '@storybook/preact';

addParameters({
  options: {
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
  },
});

const loadStories = () => {
  require('../src/stories/index.stories');

  const requireContext = require.context('../src', true, /\.stories\.js$/);

  requireContext.keys().forEach(filename => requireContext(filename));
};

configure(loadStories, module);
