const path = require('path');

module.exports = {
  addons: [
    '@storybook/addon-a11y/register',
    '@storybook/addon-storysource/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-docs/register',
    '@storybook/addon-links/register',
    '@storybook/addon-notes/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-options/register',
    '@storybook/addon-backgrounds/register',
  ],
  stories: ['../stories/**/*.stories.js'],
  webpack: async config => {
    config.module.rules.push({
      test: [/\.stories\.js$/, /index\.js$/],
      loaders: [require.resolve('@storybook/source-loader')],
      include: [path.resolve(__dirname, '../')],
      enforce: 'pre',
    });
    return config;
  },
};
