import { configure, addParameters } from '@storybook/rax';

addParameters({
  options: {
    name: 'Rax Kitchen Sink',
    url: 'https://github.com/storybookjs/storybook/tree/master/examples/rax-kitchen-sink',
    goFullScreen: false,
    showAddonsPanel: true,
    showSearchBox: false,
    hierarchySeparator: /\./,
    hierarchyRootSeparator: /\|/,
    enableShortcuts: true,
    panelPosition: 'bottom',
  },
});

configure(require.context('../src/stories', true, /\.stories\.js$/), module);
