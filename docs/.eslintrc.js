const warn = 1;

module.exports = {
  rules: {
    // because of highlight.js
    'import/extensions': [
      warn,
      {
        js: 'never',
        json: 'always',
      },
    ],
  },
  settings: {
    'import/core-modules': ['config'],
  },
};
