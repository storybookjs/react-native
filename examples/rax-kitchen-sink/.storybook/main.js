const path = require('path');

module.exports = {
  stories: ['../src/stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-storysource/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-events/register',
    '@storybook/addon-notes/register',
    '@storybook/addon-options/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-jest/register',
  ],
  webpack: async config => ({
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: [/\.stories\.js$/, /index\.js$/],
          loaders: [require.resolve('@storybook/source-loader')],
          include: [path.resolve(__dirname, '../src')],
          enforce: 'pre',
        },
        {
          test: /\.stylesheet$/,
          use: [require.resolve('stylesheet-loader')],
        },
      ],
    },
  }),
};
