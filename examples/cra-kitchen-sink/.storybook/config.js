import { configure, setAddon } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

// deprecated usage of infoAddon
import infoAddon from '@storybook/addon-info';

setOptions({
  name: 'CRA Kitchen Sink',
  url: 'https://github.com/storybooks/storybook/tree/master/examples/cra-kitchen-sink',
  goFullScreen: false,
  showStoriesPanel: true,
  showAddonsPanel: true,
  showSearchBox: false,
  addonPanelInRight: true,
  sortStoriesByKind: false,
  hierarchySeparator: /\./,
  hierarchyRootSeparator: /\|/,
});

// deprecated usage of infoAddon
setAddon(infoAddon);

function loadStories() {
  // put welcome screen at the top of the list so it's the first one displayed
  require('../src/stories/welcome');

  // automatically import all story js files that end with *.stories.js
  const req = require.context('../src/stories', true, /\.stories\.js$/)
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
