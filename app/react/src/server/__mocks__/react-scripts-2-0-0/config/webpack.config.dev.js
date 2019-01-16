const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

class CRATestPlugin1 {}
class CRATestPlugin2 {}

module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: [],
    alias: {
      'react-native': 'react-native-web',
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|mjs|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {},
            loader: 'eslint-loader',
          },
        ],
        include: 'app/src',
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: 'app/src',
        loader: 'babel-loader',
        options: {},
      },
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: 'style-loader',
        sideEffects: true,
      },
      {
        test: cssModuleRegex,
        use: 'style-loader',
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: 'sass-loader',
        sideEffects: true,
      },
      {
        test: sassModuleRegex,
        use: 'sass-loader',
      },
    ],
  },
  plugins: [new CRATestPlugin1(), new CRATestPlugin2()],
  optimization: {
    minimize: true,
  },
};
