import { load, addParameters, addDecorator } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import addCssWarning from '../src/cssWarning';

addDecorator(withA11y);
addCssWarning();

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
    docs: {
      iframeHeight: '60px',
    },
  },
});

load(require.context('../src/stories', true, /\.stories\.(ts|mdx)$/), module);
