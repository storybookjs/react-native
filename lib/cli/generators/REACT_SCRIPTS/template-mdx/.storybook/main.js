module.exports = {
  stories: ['../src/**/*.stories.(js|mdx)'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/preset-create-react-app',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],
};
