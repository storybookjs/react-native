const path = require('path');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: [/\.stories\.js$/, /index\.js$/],
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    include: [path.resolve(__dirname, '../src')],
    enforce: 'pre',
  });
  config.module.rules.push({
    test: /\.txt$/,
    use: 'raw-loader',
  });
  return config;
};
