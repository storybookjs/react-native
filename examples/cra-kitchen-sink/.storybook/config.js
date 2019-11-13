import { configure, addParameters, addDecorator } from '@storybook/react';
import { create } from '@storybook/theming/create';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    isFullscreen: false,
    showAddonsPanel: true,
    showSearchBox: false,
    panelPosition: 'right',
    hierarchySeparator: /\./,
    hierarchyRootSeparator: /\|/,
    enableShortcuts: true,
    theme: create({
      base: 'light',
      brandTitle: 'CRA Kitchen Sink',
      brandUrl: 'https://github.com/storybookjs/storybook/tree/master/examples/cra-kitchen-sink',
      gridCellSize: 12,
    }),
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, { numeric: true }),
  },
});

configure(require.context('../src/stories', true, /\.stories\.(js|mdx)$/), module);
