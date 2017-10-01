const warn = 1;

module.exports = {
  settings: {
    'import/core-modules': ['config'],
  },
  rules: {
    'import/no-unresolved': warn,
    'import/extensions': [
      // because of highlight.js
      warn,
      {
        js: 'never',
        json: 'always',
      },
    ],
  },
};
