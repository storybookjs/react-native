import autoprefixer from 'autoprefixer';
import { includePaths } from '../paths';

// Add a default custom config which is similar to what React Create App does.
module.exports = (storybookBaseConfig) => {
  const newConfig = storybookBaseConfig;
  newConfig.module.loaders = [
    ...newConfig.module.loaders,
    {
      test: /\.css?$/,
      include: includePaths,
      loaders: [
        require.resolve('style-loader'),
        require.resolve('css-loader'),
        require.resolve('postcss-loader'),
      ],
    },
    {
      test: /\.json$/,
      include: includePaths,
      loader: require.resolve('json-loader'),
    },
    {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
      include: includePaths,
      loader: require.resolve('file-loader'),
      query: {
        name: 'static/media/[name].[ext]',
      },
    },
    {
      test: /\.(mp4|webm)(\?.*)?$/,
      include: includePaths,
      loader: require.resolve('url-loader'),
      query: {
        limit: 10000,
        name: 'static/media/[name].[ext]',
      },
    },
  ];

  newConfig.postcss = () => {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9',
        ],
      }),
    ];
  };

  newConfig.resolve = {
    // These are the reasonable defaults supported by the Node ecosystem.
    extensions: ['.js', '.json', ''],
    alias: {
      // This is to support NPM2
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator'),
    },
  };

  // Return the altered config
  return newConfig;
};
