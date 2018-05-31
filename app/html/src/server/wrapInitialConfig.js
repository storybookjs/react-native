export default config => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.html$/,
        use: [
          {
            loader: require.resolve('html-loader'),
          },
        ],
      },
    ],
  },
});
