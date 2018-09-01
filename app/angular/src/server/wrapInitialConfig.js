import path from 'path';
import { ContextReplacementPlugin } from 'webpack';
import loadTsConfig from './ts_config';

export default (config, configDir) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: loadTsConfig(configDir),
          },
          require.resolve('angular2-template-loader'),
        ],
      },
      {
        test: /[/\\]@angular[/\\]core[/\\].+\.js$/,
        parser: { system: true },
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: /\.async\.html$/,
      },
      {
        test: /\.scss$/,
        use: [require.resolve('raw-loader'), require.resolve('sass-loader')],
      },
    ],
  },
  resolve: {
    ...config.resolve,
    extensions: [...config.resolve.extensions, '.ts', '.tsx'],
  },
  plugins: [
    ...config.plugins,
    // See https://github.com/angular/angular/issues/11580#issuecomment-401127742
    new ContextReplacementPlugin(/@angular(\\|\/)core(\\|\/)fesm5/, path.resolve(__dirname, '..')),
  ],
});
