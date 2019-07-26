const fs = require('fs');
const common = require('./preset');

module.exports = framework => {
  const configModule = `${__dirname}/config-${framework}`;
  const configContents = `
const { addParameters } = require('@storybook/${framework}');
const { DocsPage } = require('@storybook/addon-docs/blocks');

addParameters({
  docs: DocsPage,
});
  `.trim();
  fs.writeFileSync(`${configModule}.js`, configContents);

  function config(entry = []) {
    return [configModule, ...entry];
  }

  return {
    ...common,
    config,
  };
};
