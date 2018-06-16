export default config => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.svelte$/,
        loader: require.resolve('svelte-loader'),
        options: {},
      },
    ],
  },
  resolve: {
    ...config.resolve,
    extensions: [...config.resolve.extensions, '.svelte'],
    alias: config.resolve.alias,
  },
});
