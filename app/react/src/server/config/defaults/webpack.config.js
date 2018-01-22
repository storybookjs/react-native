import deprecate from 'util-deprecate';
import { createDefaultWebpackConfig } from '@storybook/core/server';

module.exports = deprecate(
  createDefaultWebpackConfig,
  "importing default webpack config generator from '@storybook/react/dist/server/config/defaults/webpack.config.js' is deprecated. Use third argument of your exported function instead. See https://storybook.js.org/configurations/custom-webpack-config/#full-control-mode--default"
);
