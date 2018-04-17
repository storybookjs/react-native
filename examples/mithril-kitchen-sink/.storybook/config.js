import { configure } from '@storybook/mithril';
import { setOptions } from '@storybook/addon-options';

setOptions({
  hierarchyRootSeparator: /\|/,
});

function loadStories() {
  const req = require.context('../src/stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
