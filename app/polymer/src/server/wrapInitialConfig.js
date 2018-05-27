export default config => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.html$/,
        use: [
          ...config.module.rules[0].use,
          {
            loader: require.resolve('polymer-webpack-loader'),
            options: { processStyleLinks: true },
          },
        ],
      },
    ],
  },
});
