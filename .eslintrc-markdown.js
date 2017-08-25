const error = 2;
const warn = 1;
const ignore = 0;

module.exports = {
  root: true,
  extends: ['eslint-config-airbnb', 'plugin:jest/recommended', 'prettier'],
  plugins: ['prettier', 'jest', 'react'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  globals: {
    storiesOf: true,
    addonAPI: true,
    __DEV__: true,
    fetch: true,
  },
  rules: {
    strict: [error, 'never'],
    'prettier/prettier': [
      warn,
      {
        printWidth: 100,
        tabWidth: 2,
        bracketSpacing: true,
        trailingComma: 'es5',
        singleQuote: true,
      },
    ],
    'no-console': ignore,
    'global-require': ignore,
    quotes: [warn, 'single'],
    'no-unused-vars': ignore,
    'class-methods-use-this': ignore,
    'arrow-parens': [warn, 'as-needed'],
    'space-before-function-paren': ignore,
    'import/no-unresolved': ignore,
    'import/extensions': ignore,
    'import/no-extraneous-dependencies': ignore,
    'import/prefer-default-export': ignore,
    'react/prop-types': ignore,
    'react/jsx-wrap-multilines': ignore,
    'react/jsx-uses-react': error,
    'react/jsx-uses-vars': error,
    'react/react-in-jsx-scope': ignore,
    'react/jsx-filename-extension': ignore,
    'jsx-a11y/accessible-emoji': ignore,
    'jsx-a11y/href-no-hash': ignore,
    'jsx-a11y/label-has-for': ignore,
    'jsx-a11y/anchor-is-valid': ['warn', { aspects: ['invalidHref'] }],
    'react/no-unescaped-entities': ignore,
  },
};
