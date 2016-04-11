import path from 'path';
import webpack from 'webpack';

const config = {
  devtool: '#cheap-module-source-map',
  entry: {
    admin: [
      path.resolve(__dirname, '../client/init_admin'),
    ],
    preview: [
      path.resolve(__dirname, '../client/init_preview'),
    ],
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
        include: [path.resolve('./'), __dirname],
      },
    ],
  },
};

export default config;
