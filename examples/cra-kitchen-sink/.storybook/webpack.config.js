const webpack = require('webpack');

// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  const config = genDefaultConfig(storybookBaseConfig, configType);

  // Make whatever fine-grained changes you need
  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      chunks: ['preview'],
      minChunks: function (module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf("node_modules") !== -1;
      },
    })
  );

  // Return the altered config
  return config;
};
