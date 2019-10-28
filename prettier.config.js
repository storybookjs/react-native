const base = require('@storybook/linter-config/prettier.config');

module.exports = {
  ...base,
  overrides: [
    {
      files: '*.html',
      options: { parser: 'babel' },
    },
  ],
};
