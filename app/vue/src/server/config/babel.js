const findCacheDir = require('find-cache-dir');

module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  cacheDirectory: findCacheDir({ name: 'react-storybook' }),
  presets: [
    [
      require.resolve('babel-preset-env'),
      {
        targets: {
          browsers: ['last 2 versions', 'safari >= 7'],
        },
        modules: false,
      },
    ],
    require.resolve('babel-preset-stage-0'),
    require.resolve('babel-preset-react'),
  ],
  plugins: [
    require.resolve('babel-plugin-transform-regenerator'),
    [
      require.resolve('babel-plugin-transform-runtime'),
      {
        helpers: true,
        polyfill: true,
        regenerator: true,
      },
    ],
  ],
};
