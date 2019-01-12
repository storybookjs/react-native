const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, '../src'),
        use: [require.resolve('react-docgen-typescript-loader')],
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
};
