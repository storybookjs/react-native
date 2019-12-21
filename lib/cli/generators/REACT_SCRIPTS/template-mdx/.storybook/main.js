module.exports = {
  stories: ['../src/stories/**/*.stories.(js|mdx)'],
  addons: ['@storybook/addon-actions/register', '@storybook/addon-links/register'],
  presets: [
    '@storybook/preset-create-react-app',
    {
      name: '@storybook/addon-docs/preset',
      options: {
        configureJSX: true,
      },
    },
  ],
};
