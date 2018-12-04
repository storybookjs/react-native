module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  presets: [
    [
      require.resolve('babel-preset-env'),
      {
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
        shippedProposals: true,
      },
    ],
    require.resolve('babel-preset-react'),
  ],
  plugins: [
    require.resolve('babel-plugin-macros'),
    require.resolve('babel-plugin-syntax-trailing-function-commas'),
    require.resolve('babel-plugin-syntax-async-functions'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
    require.resolve('babel-plugin-transform-regenerator'),
    // Polyfills the runtime needed for async/await and generators
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
