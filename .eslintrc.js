const error = 2;
const warn = 1;
const ignore = 0;

module.exports = {
  root: true,
  extends: ['eslint-config-airbnb', 'plugin:jest/recommended', 'prettier'],
  plugins: ['prettier', 'jest', 'react', 'json'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
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
    quotes: [warn, 'single'],
    'class-methods-use-this': ignore,
    'arrow-parens': [warn, 'as-needed'],
    'space-before-function-paren': ignore,
    'import/no-unresolved': warn,
    'import/extensions': [
      warn,
      {
        js: 'never',
        json: 'always',
      },
    ],
    'import/no-extraneous-dependencies': [
      warn,
      {
        devDependencies: [
          '**/*.test.js',
          '**/scripts/*.js',
          '**/stories/*.js',
          '**/__tests__/*.js',
        ],
        peerDependencies: true,
      },
    ],
    'import/prefer-default-export': ignore,
    'react/jsx-wrap-multilines': ignore,
    'react/jsx-indent': ignore,
    'react/jsx-indent-props': ignore,
    'react/jsx-closing-bracket-location': ignore,
    'react/jsx-uses-react': error,
    'react/jsx-uses-vars': error,
    'react/react-in-jsx-scope': error,
    'react/jsx-filename-extension': [
      warn,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'jsx-a11y/accessible-emoji': ignore,
    'react/no-unescaped-entities': ignore,
  },
};
