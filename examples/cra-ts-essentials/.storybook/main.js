module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  presets: [
    '@storybook/preset-create-react-app',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
      },
    },
  ],
};
