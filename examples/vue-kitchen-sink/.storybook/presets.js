const path = require('path');

module.exports = [
  {
    name: '@storybook/addon-docs/vue/preset',
    options: {
      configureJSX: true,
      sourceInclude: [path.resolve(__dirname, '../src')],
    },
  },
];
