import { excludePaths } from '../config/utils';

export default options => ({
  test: /\.(mjs|jsx?)$/,
  use: [
    {
      loader: 'babel-loader',
      options,
    },
  ],
  exclude: excludePaths,
});
