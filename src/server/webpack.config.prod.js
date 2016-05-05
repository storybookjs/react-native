import path from 'path';
import webpack from 'webpack';

const managerEntry =
  process.env.DEV_BUILD ?
  path.resolve(__dirname, '../../src/client/manager') :
  path.resolve(__dirname, '../manager');

const config = {
  devtool: '#cheap-module-source-map',
  entry: {
    manager: [
      managerEntry,
    ],
    preview: [],
  },
  output: {
    filename: '[name].bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: { presets: ['react', 'es2015', 'stage-2'] },
        exclude: [path.resolve('./node_modules'), path.resolve(__dirname, 'node_modules')],
        include: [path.resolve('./'), __dirname, path.resolve(__dirname, '../../src')],
      },
    ],
  },
};

export default config;
