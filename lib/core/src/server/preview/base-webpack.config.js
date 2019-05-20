import autoprefixer from 'autoprefixer';

export function createDefaultWebpackConfig(storybookBaseConfig) {
  return {
    ...storybookBaseConfig,
    module: {
      ...storybookBaseConfig.module,
      rules: [
        ...storybookBaseConfig.module.rules,
        {
          test: /\.css$/,
          sideEffects: true,
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
                ident: 'postcss',
                postcss: {},
                plugins: () => [
                  require('postcss-flexbugs-fixes'), // eslint-disable-line global-require
                  autoprefixer({
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          ],
        },
        {
          test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/,
          loader: require.resolve('file-loader'),
          query: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
          loader: require.resolve('url-loader'),
          query: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
  };
}
