export function webpack(config) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.marko$/,
          loader: require.resolve('marko-loader'),
          options: {
            compiler: require.resolve('marko/compiler'),
          },
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.marko'],
    },
  };
}
