import webpack from 'webpack';

export async function managerWebpack(config: any, options: any) {
  const { storybookOptions } = options;

  return {
    ...config,
    plugins: [
      ...(config?.plugins ?? []),
      new webpack.DefinePlugin({
        storybookOptions: JSON.stringify(storybookOptions),
      }),
    ],
  };
}
