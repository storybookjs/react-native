/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/react';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
    // react is Storybook's "native" framework, so it's stories are inherently prepared to be rendered inline
    prepareForInline: (storyFn: StoryFn) => storyFn(),
  },
});
