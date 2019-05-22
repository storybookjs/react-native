/** @jsx h */
import { addParameters, configure, addDecorator } from '@storybook/preact';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
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
