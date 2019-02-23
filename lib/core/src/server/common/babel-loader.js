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
