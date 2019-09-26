const ignore = 0;

module.exports = {
  root: true,
  extends: ['@storybook/eslint-config-storybook'],
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
