module.exports = {
  plugins: [
    'remark-preset-lint-recommended',
    ['remark-lint-list-item-indent', false],
    [
      'remark-lint-code',
      {
        js: {
          module: 'node_modules/remark-lint-code-eslint',
          options: {
            fix: true,
            configFile: '.eslintrc-markdown.js',
          },
        },
      },
    ],
  ],
};
