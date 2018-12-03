import { configure, addDecorator } from '@storybook/svelte';
import { withOptions } from '@storybook/addon-options';

// Used with @storybook/addon-options/register
addDecorator(withOptions({ hierarchyRootSeparator: /\|/ }));

function loadStories() {
  require('../src/stories');

  const req = require.context('../src/stories', true, /\.stories\.js$/);

  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
