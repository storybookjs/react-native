import { load, addParameters } from '@storybook/rax';

addParameters({
  options: {
    name: 'Rax Kitchen Sink',
    url: 'https://github.com/storybookjs/storybook/tree/master/examples/rax-kitchen-sink',
    goFullScreen: false,
    showAddonsPanel: true,
    showSearchBox: false,
    sortStoriesByKind: false,
    hierarchySeparator: /\./,
    hierarchyRootSeparator: /\|/,
    enableShortcuts: true,
    panelPosition: 'bottom',
  },
});

load(require.context('../src/stories', true, /\.stories\.js$/), module);
