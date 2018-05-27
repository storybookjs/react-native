import baseConfig from './babel';

export default {
  ...baseConfig,
  presets: [
    ...baseConfig.presets,
    [
      require.resolve('babel-preset-minify'),
      {
        mangle: false,
      },
    ],
  ],
};
