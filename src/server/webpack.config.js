import path from 'path';
import webpack from 'webpack';

const config = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    admin: [
      path.resolve(__dirname, '../client/init_admin'),
    ],
    preview: [
      'webpack-hot-middleware/client',
      path.resolve(__dirname, '../client/init_preview'),
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: { presets: ['react', 'es2015', 'stage-2'] },
        exclude: [path.resolve('./node_modules'), path.resolve(__dirname, 'node_modules')],
        include: [path.resolve('./'), __dirname],
      },
    ],
  },
};

export default config;
