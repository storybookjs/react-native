import autoprefixer from 'autoprefixer';
import { includePaths } from '../utils';

// Add a default custom config which is similar to what React Create App does.
module.exports = (storybookBaseConfig) => {
  const newConfig = { ...storybookBaseConfig };
  newConfig.module.loaders = [
    ...storybookBaseConfig.module.loaders,
    // This loads all other assets using the file-loader except for
    // the excluded extentions. Because they have their own loaders.
    {
      include: includePaths,
      exclude: [
        /\.html$/,
        /\.(js|jsx)$/,
        /\.css$/,
        /\.json$/,
      ],
      loader: require.resolve('file-loader'),
      query: {
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
    {
      test: /\.css?$/,
      include: includePaths,
      loaders: [
        require.resolve('style-loader'),
        `${require.resolve('css-loader')}?importLoaders=1`,
        require.resolve('postcss-loader'),
      ],
    },
    {
      test: /\.json$/,
      include: includePaths,
      loader: require.resolve('json-loader'),
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

  newConfig.resolve.alias = {
    ...storybookBaseConfig.resolve.alias,
    // This is to support NPM2
    'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator'),
  };

  // Return the altered config
  return newConfig;
};
