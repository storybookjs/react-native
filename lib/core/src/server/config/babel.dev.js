export default {
  // this flag is here to allow presets to recognize the SB default config
  storybookDefault: true,
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
      },
    ],
  ],
  plugins: [
    require.resolve('babel-plugin-macros'),
    require.resolve('@babel/plugin-transform-regenerator'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        helpers: true,
        regenerator: true,
      },
    ],
  ],
};
