module.exports = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
    '../other_components/AnotherButton/AnotherButton.stories.tsx',
  ],
  logLevel: 'debug',
  env: () => ({}),
  addons: ['@storybook/addon-essentials'],
};
