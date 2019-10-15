/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/react';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
    // react is Storybook's "native" framework, so it's stories are inherently prepared to be rendered inline
    // NOTE: that the result is a react element. Hooks support is provided by the outer code.
    prepareForInline: storyFn => storyFn(),
  },
});
