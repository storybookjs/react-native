const path = require('path');

module.exports = (storybookBaseConfig, configType, defaultConfig) => {

  defaultConfig.module.rules.push({
    test: [
      /\.stories\.js$/,
      /index\.js$/
    ],
    loaders: [ require.resolve('babel-loader'), require.resolve('@storybook/addon-stories/loader') ],
    include: [
      path.resolve(__dirname, '../src')
    ],
  });

  return defaultConfig;
};