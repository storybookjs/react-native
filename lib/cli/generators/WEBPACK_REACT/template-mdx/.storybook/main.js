module.exports = {
  stories: ['../stories/**/*.stories.(js|mdx)'],
  addons: ['@storybook/addon-actions/register', '@storybook/addon-links/register'],
  presets: [
    {
      name: '@storybook/addon-docs/preset',
      options: { configureJSX: true },
    },
  ],
  webpack: async config => {
    // do mutation to the config

    return config;
  },
};
