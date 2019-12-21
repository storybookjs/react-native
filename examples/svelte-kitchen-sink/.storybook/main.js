const path = require('path');

module.exports = {
  stories: ['../src/stories/**/*.stories.*'],
  addons: [
    '@storybook/addon-storysource/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-notes/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-options/register',
    '@storybook/addon-a11y/register',
  ],
  webpack: async config => {
    config.module.rules.push({
      test: [/\.stories\.js$/, /index\.js$/],
      loaders: [require.resolve('@storybook/source-loader')],
      include: [path.resolve(__dirname, '../src')],
      enforce: 'pre',
    });
    return config;
  },
};
