const path = require('path');
const webpack = require('webpack');

module.exports = {
  stories: ['../src/stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    '@storybook/addon-notes',
    '@storybook/addon-knobs',
    '@storybook/addon-links',
    '@storybook/addon-viewport',
    '@storybook/addon-options',
    '@storybook/addon-a11y',
  ],
  webpackFinal: async config => {
    config.module.rules.push({
      test: [/\.stories\.js$/, /index\.js$/],
      loaders: [require.resolve('@storybook/source-loader')],
      include: [path.resolve(__dirname, '../src')],
      enforce: 'pre',
    });
    config.plugins.push(new webpack.IgnorePlugin(/vertx/));
    return config;
  },
};
