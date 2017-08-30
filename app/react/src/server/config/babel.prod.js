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
        modules: false,
      },
    ],
    require.resolve('babel-preset-stage-0'),
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-minify'),
  ],
  plugins: [
    [
      require.resolve('babel-plugin-react-docgen'),
      {
        DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES',
      },
    ],
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
