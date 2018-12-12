const error = 2;
const warn = 1;
const ignore = 0;

module.exports = {
  root: true,
  extends: [
    'airbnb',
    'plugin:jest/recommended',
    'plugin:import/react-native',
    'prettier',
    'prettier/react',
  ],
  plugins: ['prettier', 'jest', 'import', 'react', 'jsx-a11y', 'json'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  settings: {
    'import/core-modules': ['enzyme'],
    'import/ignore': ['node_modules\\/(?!@storybook)'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  rules: {
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
    'no-debugger': process.env.NODE_ENV === 'production' ? error : ignore,
    'class-methods-use-this': ignore,
    'import/extensions': [
      error,
      'always',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [
      error,
      {
        devDependencies: [
          'examples/**',
          'examples-native/**',
          '**/example/**',
          '*.js',
          '**/*.test.js',
          '**/*.stories.js',
          '**/scripts/*.js',
          '**/stories/**/*.js',
          '**/__tests__/**/*.js',
          '**/.storybook/**/*.js',
        ],
        peerDependencies: true,
      },
    ],
    'import/prefer-default-export': ignore,
    'import/default': error,
    'import/named': error,
    'import/namespace': error,
    'react/jsx-filename-extension': [
      warn,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/jsx-no-bind': [
      error,
      {
        ignoreDOMComponents: true,
        ignoreRefs: true,
        allowArrowFunctions: true,
        allowFunctions: true,
        allowBind: true,
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      warn,
      {
        labelComponents: ['CustomInputLabel'],
        labelAttributes: ['label'],
        controlComponents: ['CustomInput'],
        depth: 3,
      },
    ],
    'react/no-unescaped-entities': ignore,
    'jsx-a11y/label-has-for': [
      error,
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      error,
      {
        components: ['RoutedLink', 'MenuLink', 'LinkTo', 'Link'],
        specialLink: ['overrideParams', 'kind', 'story', 'to'],
      },
    ],
    'no-underscore-dangle': [
      error,
      {
        allow: ['__STORYBOOK_CLIENT_API__', '__STORYBOOK_ADDONS_CHANNEL__'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/__tests__/**', '**/*.test.js/**', '**/*.spec.js/**'],
      rules: {
        'import/no-extraneous-dependencies': ignore,
      },
    },
    {
      files: ['**/react-native*/**', '**/REACT_NATIVE*/**', '**/crna*/**'],
      rules: {
        'jsx-a11y/accessible-emoji': ignore,
      },
    },
    {
      files: '**/.storybook/config.js',
      rules: {
        'global-require': ignore,
      },
    },
  ],
};
