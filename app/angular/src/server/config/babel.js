module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  presets: [
    [
      require.resolve('babel-preset-env'),
      {
        targets: {
          browsers: ['last 2 versions', 'safari >= 7'],
        },
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
      },
    ],
    require.resolve('babel-preset-stage-0'),
  ],
  plugins: [require.resolve('babel-plugin-macros')],
};
