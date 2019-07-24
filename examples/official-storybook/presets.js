const path = require('path');

module.exports = [
  {
    name: '@storybook/addon-docs/react/preset',
    options: {
      sourceInclude: [
        path.resolve(__dirname, './stories'),
        path.resolve(__dirname, '../../lib/ui/src'),
        path.resolve(__dirname, '../../lib/components/src'),
      ],
    },
  },
];
