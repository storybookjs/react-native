import { configure, addParameters } from '@storybook/rax';

addParameters({
  options: {
    name: 'Rax Kitchen Sink',
    url: 'https://github.com/storybookjs/storybook/tree/master/examples/rax-kitchen-sink',
    goFullScreen: false,
    showAddonsPanel: true,
    showSearchBox: false,
    addonPanelInRight: true,
    sortStoriesByKind: false,
    hierarchySeparator: /\./,
    hierarchyRootSeparator: /\|/,
    enableShortcuts: true,
  },
});

function loadStories() {
  // put welcome screen at the top of the list so it's the first one displayed
  // require('../src/stories/index.stories');

  // automatically import all story js files that end with *.stories.js
  const req = require.context('../stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
