/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/html';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});
