import { configure, addParameters, addDecorator } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import addCssWarning from '../src/cssWarning';
import { extractProps, extractComponentDescription, setCompodocJson } from './compodoc';

import docJson from '../documentation.json';

setCompodocJson(docJson);

addDecorator(withA11y);
addCssWarning();

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
  docs: {
    // inlineStories: true,
    iframeHeight: '60px',
    extractProps,
    extractComponentDescription,
  },
});

configure(require.context('../src/stories', true, /\.stories\.(ts|mdx)$/), module);
