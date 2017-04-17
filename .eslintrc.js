const error = 2;
const warn = 1;
const ignore = 0;

module.exports = {
  extends: [
    // './node_modules/eslint-config-airbnb-base/rules/es6.js',
    'airbnb-base',
    'plugin:jest/recommended',
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
    strict: [error, "never"],
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
    'import/no-extraneous-dependencies': [error, { devDependencies: true, peerDependencies: true }],
    'import/prefer-default-export': ignore,
    'react/jsx-uses-react': error,
    'react/jsx-uses-vars': error,
    'react/react-in-jsx-scope': error,
  },
}
