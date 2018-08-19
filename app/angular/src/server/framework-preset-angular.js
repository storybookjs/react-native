import loadTsConfig from './ts_config';

function extendWebpack(config, { configDir }) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: loadTsConfig(configDir),
            },
            require.resolve('angular2-template-loader'),
          ],
        },
        {
          test: /[/\\]@angular[/\\]core[/\\].+\.js$/,
          parser: { system: true },
        },
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: /\.async\.html$/,
        },
        {
          test: /\.scss$/,
          use: [require.resolve('raw-loader'), require.resolve('sass-loader')],
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.ts', '.tsx'],
    },
  };
}

export default {
  extendWebpack,
};
