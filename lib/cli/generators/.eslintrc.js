const ignore = 0;

module.exports = {
  overrides: {
    files: ['*/template/**', '*/template/.storybook/**'],
    rules: {
      'import/no-unresolved': ignore,
      'import/no-extraneous-dependencies': ignore,
      'global-require': ignore,
    },
  },
};
