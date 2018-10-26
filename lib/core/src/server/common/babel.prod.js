import baseConfig from './babel.dev';

export default {
  ...baseConfig,
  presets: [
    ...baseConfig.presets,
    [
      require.resolve('babel-preset-minify'),
      {
        builtIns: false,
        mangle: false,
      },
    ],
  ],
};
