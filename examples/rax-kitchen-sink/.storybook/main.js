const path = require('path');

module.exports = {
  stories: ['../src/stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-events',
    '@storybook/addon-notes',
    '@storybook/addon-options',
    '@storybook/addon-knobs',
    '@storybook/addon-backgrounds',
    '@storybook/addon-a11y',
    '@storybook/addon-jest',
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
