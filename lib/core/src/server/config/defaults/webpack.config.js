import autoprefixer from 'autoprefixer';

export function createDefaultWebpackConfig(storybookBaseConfig, includePaths) {
  const newConfig = { ...storybookBaseConfig };

  newConfig.module.rules = [
    ...storybookBaseConfig.module.rules,
    {
      test: /\.css$/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
            plugins: () => [
              require('postcss-flexbugs-fixes'), // eslint-disable-line
              autoprefixer({
                browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
                flexbox: 'no-2009',
              }),
            ],
          },
        },
      ],
    },
    {
      test: /\.json$/,
      include: includePaths,
      loader: require.resolve('json-loader'),
    },
    {
      test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
      include: includePaths,
      loader: require.resolve('file-loader'),
      query: {
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
    {
      test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
      include: includePaths,
      loader: require.resolve('url-loader'),
      query: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
  ];

  newConfig.resolve.alias = {
    ...storybookBaseConfig.resolve.alias,
    // This is to support NPM2
    'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator'),
  };

  newConfig.node = {
    ...storybookBaseConfig.node,
    __dirname: true,
  };

  // Return the altered config
  return newConfig;
}
