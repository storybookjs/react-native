import path from 'path';
import { ContextReplacementPlugin } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import getTsLoaderOptions from './ts_config';

export function webpack(config, { configDir }) {
  const tsLoaderOptions = getTsLoaderOptions(configDir);
  return {
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
              options: tsLoaderOptions,
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
      new ContextReplacementPlugin(
        /@angular(\\|\/)core(\\|\/)fesm5/,
        path.resolve(__dirname, '..')
      ),
      new ForkTsCheckerWebpackPlugin({
        tsconfig: tsLoaderOptions.configFile,
      }),
    ],
  };
}
