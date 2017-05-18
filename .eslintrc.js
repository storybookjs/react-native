const error = 2;
const warn = 1;
const ignore = 0;

module.exports = {
  extends: [
    '@ndelangen/eslint-config-airbnb',
    'prettier',
    'plugin:jest/recommended'
  ],
  plugins: [
    'prettier',
    'jest',
    'react',
  ],
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
    'prettier/prettier': ['warn', {
      printWidth: 100,
      tabWidth: 2,
      bracketSpacing: true,
      trailingComma: 'all',
      singleQuote: true,
    }],
    quotes: ['warn', 'single'],
    'class-methods-use-this': ignore,
    'arrow-parens': ['warn', 'as-needed'],
    'space-before-function-paren': ignore,
    'import/no-unresolved': warn,
    'import/extentions': warn,
    'import/no-extraneous-dependencies': [warn, {
      devDependencies: [
        '**/*.test.js',
        '**/scripts/*.js',
        '**/stories/*.js',
        '**/__tests__/*.js'
      ],
      peerDependencies: true
    }],
    'import/prefer-default-export': ignore,
    'react/jsx-uses-react': error,
    'react/jsx-uses-vars': error,
    'react/react-in-jsx-scope': error,
    'react/jsx-filename-extension': [warn, {
      extensions: ['.js', '.jsx']
    }],
    'jsx-a11y/accessible-emoji': ignore,
    'react/no-unescaped-entities': ignore,
  },
}
