const warn = 1;

module.exports = {
  globals: {
    graphql: false,
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
