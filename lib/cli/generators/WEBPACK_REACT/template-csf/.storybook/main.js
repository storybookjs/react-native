module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: ['@storybook/addon-actions/register', '@storybook/addon-links/register'],
  webpack: async config => {
    // do mutation to the config

    return config;
  },
};
