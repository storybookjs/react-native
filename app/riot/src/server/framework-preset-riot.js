export function webpack(config) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.tag$/,
          use: [
            {
              loader: require.resolve('riot-tag-loader'),
            },
          ],
        },
      ],
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        'riot-compiler': 'riot-compiler/dist/es6.compiler',
      },
    },
  };
}
