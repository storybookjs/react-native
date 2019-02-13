import { includePaths, excludePaths } from '../config/utils';

export default options => ({
  test: /\.(mjs|jsx?)$/,
  use: [
    {
      loader: 'babel-loader',
      options,
    },
  ],
  include: includePaths,
  exclude: excludePaths,
});

export const nodeModulesBabelLoader = {
  test: /\.js$/,
  include: /\/node_modules\/safe-eval\//,
  use: [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        babelrc: false,
        presets: [
          [
            'env',
            {
              modules: 'commonjs',
            },
          ],
        ],
      },
    },
  ],
};
