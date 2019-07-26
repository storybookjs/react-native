import { configure, addParameters, addDecorator } from '@storybook/html';
import { withA11y } from '@storybook/addon-a11y';
import { DocsPage } from '@storybook/addon-docs/blocks';

addDecorator(withA11y);

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  options: {
    hierarchyRootSeparator: /\|/,
    docs: {
      iframeHeight: '200px',
    },
  },
  docs: DocsPage,
});

configure(require.context('../stories', true, /\.stories\.(js|mdx)$/), module);
