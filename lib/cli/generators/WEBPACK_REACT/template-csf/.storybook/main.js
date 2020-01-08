module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpack: async config => {
    // do mutation to the config

    return config;
  },
};
