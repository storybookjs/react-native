import path from 'path';
import webpack from 'webpack';

const entries = {
  preview: [],
};

// We will copy the manager bundle distributed via the React Storybook
// directly into the production build overring webpack.
// But, in the DEV_BUILD we need to play with that. That's why we copy that.
if (process.env.DEV_BUILD) {
  entries.manager = [__dirname, '../../src/client/manager'];
}

const config = {
  devtool: '#cheap-module-source-map',
  entry: entries,
  output: {
    filename: '[name].bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: { presets: ['react', 'es2015', 'stage-0'] },
        exclude: [path.resolve('./node_modules'), path.resolve(__dirname, 'node_modules')],
        include: [path.resolve('./'), __dirname, path.resolve(__dirname, '../../src')],
      },
    ],
  },
};

export default config;
