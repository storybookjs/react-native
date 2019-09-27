import path from 'path';
import { ContextReplacementPlugin, Configuration } from 'webpack';
import autoprefixer from 'autoprefixer';
import getTsLoaderOptions from './ts_config';
import createForkTsCheckerInstance from './create-fork-ts-checker-plugin';

export function webpack(
  config: Configuration,
  { configDir }: { configDir: string }
): Configuration {
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
              loader: 'ts-loader',
              options: tsLoaderOptions,
            },
            { loader: 'angular2-template-loader' },
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
            { loader: 'raw-loader' },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                plugins: [autoprefixer()],
              },
            },
            { loader: 'sass-loader' },
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
      createForkTsCheckerInstance(tsLoaderOptions),
    ],
  };
}
