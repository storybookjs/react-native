export default config => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.vue$/,
        loader: require.resolve('vue-loader'),
        options: {},
      },
    ],
  },
  resolve: {
    ...config.resolve,
    extensions: [...config.resolve.extensions, '.vue'],
    alias: {
      ...config.resolve.alias,
      vue$: require.resolve('vue/dist/vue.esm.js'),
    },
  },
});
