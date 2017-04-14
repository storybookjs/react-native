import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import { includePaths, excludePaths } from '../utils';

// Add a default custom config which is similar to what React Create App does.
module.exports = storybookBaseConfig => {
  const newConfig = { ...storybookBaseConfig };

  newConfig.plugins = [
    ...storybookBaseConfig.plugins,
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer({
            browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
          }),
        ],
      },
    }),
  ];
  newConfig.module.rules = [
    ...storybookBaseConfig.module.rules,
    {
      test: /\.css?$/,
      include: includePaths,
      exclude: excludePaths,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        'postcss-loader',
      ],
    },
    {
      test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
      include: includePaths,
      exclude: excludePaths,
      loader: 'file-loader',
      query: {
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
    {
      test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
      include: includePaths,
      exclude: excludePaths,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
  ];

  // Return the altered config
  return newConfig;
};
