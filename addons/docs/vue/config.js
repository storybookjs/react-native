/* eslint-disable import/no-extraneous-dependencies */
const { addParameters } = require('@storybook/vue');
const { DocsPage } = require('@storybook/addon-docs/blocks');

addParameters({
  docs: DocsPage,
});
