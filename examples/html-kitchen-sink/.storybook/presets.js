const path = require('path');

module.exports = [
  {
    name: '@storybook/addon-docs/html/preset',
    options: {
      configureJSX: true,
      sourceInclude: [path.resolve(__dirname, '../stories')],
    },
  },
];
