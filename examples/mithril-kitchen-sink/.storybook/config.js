import { configure, addDecorator } from '@storybook/mithril';
import { withOptions } from '@storybook/addon-options';

addDecorator(
  withOptions({
    hierarchyRootSeparator: /\|/,
  })
);

function loadStories() {
  const req = require.context('../src/stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
