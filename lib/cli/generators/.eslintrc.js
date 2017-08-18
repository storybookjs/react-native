const ignore = 0;

module.exports = {
  overrides: {
    files: '*/template/**',
    rules: {
      'import/no-unresolved': ignore,
      'import/no-extraneous-dependencies': ignore,
      'import/extensions': ignore,
      'global-require': ignore,
      'no-console': ignore,
    },
  },
};
