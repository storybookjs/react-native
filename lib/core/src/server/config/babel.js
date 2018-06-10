export default {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
      },
    ],
    [require.resolve('@babel/preset-stage-0'), { decoratorsLegacy: true }],
  ],
  plugins: [
    require.resolve('babel-plugin-macros'),
    require.resolve('@babel/plugin-transform-regenerator'),
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        helpers: true,
        polyfill: true,
        regenerator: true,
      },
    ],
  ],
};
