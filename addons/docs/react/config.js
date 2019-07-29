/* eslint-disable import/no-extraneous-dependencies */
const { addParameters } = require('@storybook/react');
const { DocsPage } = require('@storybook/addon-docs/blocks');

addParameters({
  docs: DocsPage,
});
