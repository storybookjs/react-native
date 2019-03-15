import path from 'path';
import { Configuration, ContextReplacementPlugin } from 'webpack';
import autoprefixer from 'autoprefixer';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import getTsLoaderOptions from './ts_config';
import { createForkTsCheckerInstance } from './create-fork-ts-checker-plugin';

export function webpack(config: Configuration, { configDir }: { configDir: string }) {
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
          test: /\.s(c|a)ss$/,
          use: [
            require.resolve('raw-loader'),
            {
              loader: require.resolve('postcss-loader'),
              options: {
                plugins: [autoprefixer()],
              },
            },
            require.resolve('sass-loader'),
          ],
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: ['.ts', '.tsx', ...config.resolve.extensions],
    },
    plugins: [
      ...config.plugins,
      // See https://github.com/angular/angular/issues/11580#issuecomment-401127742
      new ContextReplacementPlugin(
        /@angular(\\|\/)core(\\|\/)(fesm5|bundles)/,
        path.resolve(__dirname, '..')
      ),
      // tslint complained about the exports of the ForkTs package, therefore I needed to cast it
      createForkTsCheckerInstance(tsLoaderOptions) as ForkTsCheckerWebpackPlugin,
    ],
  };
}
