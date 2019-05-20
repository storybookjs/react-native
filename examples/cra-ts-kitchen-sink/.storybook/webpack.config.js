const path = require('path');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    include: path.resolve(__dirname, '../src'),
    use: [require.resolve('react-docgen-typescript-loader')],
  });
  return config;
};
