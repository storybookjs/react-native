import { configure, addParameters, addDecorator } from '@storybook/mithril';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

function loadStories() {
  const req = require.context('../src/stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
