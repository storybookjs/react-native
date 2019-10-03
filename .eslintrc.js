const ignore = 0;

module.exports = {
  root: true,
  extends: ['@storybook/eslint-config-storybook'],
  rules: {
    'import/extensions': [
      'error',
      'never',
      { ignorePackages: true, md: 'always', svg: 'always', json: 'always', tag: 'always' },
    ],
    'import/no-unresolved': [2, { ignore: ['@storybook'] }],
    'react/state-in-constructor': ignore,
    'react/static-property-placement': ignore,
    'react/jsx-props-no-spreading': ignore,
    'react/jsx-fragments': ignore,
    '@typescript-eslint/ban-ts-ignore': ignore,
    '@typescript-eslint/no-object-literal-type-assertion': ignore,
    'react/sort-comp': 'warn',
    'max-classes-per-file': ignore,
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
        '@typescript-eslint/no-empty-function': ignore,
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
