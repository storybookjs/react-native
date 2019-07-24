const path = require('path');

module.exports = [
  {
    name: '@storybook/addon-docs/angular/preset',
    options: {
      configureJSX: true,
      sourceInclude: [path.resolve(__dirname, '../src')],
    },
  },
];
