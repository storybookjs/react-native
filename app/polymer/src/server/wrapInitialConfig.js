import { IgnorePlugin } from 'webpack';

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
  plugins: [
    ...config.plugins,
    // See https://github.com/webcomponents/webcomponentsjs/issues/794#issuecomment-386554298
    new IgnorePlugin(/^vertx$/),
  ],
});
