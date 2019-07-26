import { load, addParameters, addDecorator } from '@storybook/react';
import { create } from '@storybook/theming';
import { withA11y } from '@storybook/addon-a11y';
import { DocsPage } from '@storybook/addon-docs/blocks';

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
    storySort: (a, b) => a[1].id.localeCompare(b[1].id),
  },
  docs: DocsPage,
});

load(require.context('../src/stories', true, /\.stories\.(js|mdx)$/), module);
