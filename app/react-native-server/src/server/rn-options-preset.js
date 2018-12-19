import webpack from 'webpack';

export async function managerWebpack(config, options) {
  const { storybookOptions } = options;

  return {
    ...config,
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({
        storybookOptions: JSON.stringify(storybookOptions),
      }),
    ],
  };
}
