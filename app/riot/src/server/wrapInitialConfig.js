export default config => ({
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
});
