module.exports = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
    '../other_components/AnotherButton/AnotherButton.stories.tsx',
  ],
  logLevel: 'debug',
  env: () => ({}),
  core: {
    builder: 'webpack5',
  },
  addons: ['@storybook/addon-essentials'],
};
