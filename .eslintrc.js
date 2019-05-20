const error = 2;
const warn = 1;
const ignore = 0;

module.exports = {
  root: true,
  extends: [
    'airbnb',
    'plugin:jest/recommended',
    'plugin:import/react-native',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: [
    '@typescript-eslint',
    'prettier',
    'jest',
    'import',
    'react',
    'jsx-a11y',
    'json',
    'html',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: { es6: true, node: true, 'jest/globals': true },
  settings: {
    'import/core-modules': ['enzyme'],
    'import/ignore': ['node_modules\\/(?!@storybook)'],
    'import/resolver': { node: { extensions: ['.js', '.ts', '.tsx', '.mjs'] } },
    'html/html-extensions': ['.html'],
  },
  rules: {
    'prettier/prettier': [warn],
    'no-debugger': process.env.NODE_ENV === 'production' ? error : ignore,
    'class-methods-use-this': ignore,
    'import/extensions': [
      error,
      'always',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
        mjs: 'never',
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
          '**/*.stories.*',
          '**/scripts/*.js',
          '**/stories/**/*.js',
          '**/__tests__/**/*.js',
          '**/.storybook/**/*.*',
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
        extensions: ['.js', '.jsx', '.tsx'],
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
    'jsx-a11y/accessible-emoji': ignore,
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
    'jsx-a11y/label-has-for': [error, { required: { some: ['nesting', 'id'] } }],
    'jsx-a11y/anchor-is-valid': [
      error,
      {
        components: ['A', 'LinkTo', 'Link'],
        specialLink: ['overrideParams', 'kind', 'story', 'to'],
      },
    ],
    'no-underscore-dangle': [
      error,
      { allow: ['__STORYBOOK_CLIENT_API__', '__STORYBOOK_ADDONS_CHANNEL__'] },
    ],
    '@typescript-eslint/no-var-requires': ignore,
    '@typescript-eslint/camelcase': ignore,
    '@typescript-eslint/no-unused-vars': ignore,
    '@typescript-eslint/explicit-member-accessibility': ignore,
    '@typescript-eslint/explicit-function-return-type': ignore,
    '@typescript-eslint/no-explicit-any': ignore, // would prefer to enable this
    '@typescript-eslint/no-use-before-define': ignore, // this is duplicated
    '@typescript-eslint/interface-name-prefix': ignore, // I don't agree
  },
  overrides: [
    {
      files: [
        '**/__tests__/**',
        '**/*.test.*',
        '**/*.stories.*',
        '**/storyshots/**/stories/**',
        'docs/src/new-components/lib/StoryLinkWrapper.js',
        'docs/src/stories/**',
      ],
      rules: {
        'import/no-extraneous-dependencies': ignore,
      },
    },
    { files: '**/.storybook/config.js', rules: { 'global-require': ignore } },
    {
      files: ['**/*.stories.*'],
      rules: {
        'no-console': ignore,
      },
    },
    {
      files: ['**/*.tsx', '**/*.ts'],
      rules: {
        'react/prop-types': ignore, // we should use types
        'no-dupe-class-members': ignore, // this is called overloads in typescript
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'vars-on-top': ignore,
        'no-var': ignore, // this is how typescript works
        'spaced-comment': ignore,
      },
    },
  ],
};
