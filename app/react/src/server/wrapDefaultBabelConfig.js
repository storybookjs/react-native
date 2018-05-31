export default config => ({
  ...config,
  presets: [...config.presets, require.resolve('babel-preset-react')],
});
