export function babelDefault(config) {
  return {
    ...config,
    presets: [
      ...config.presets,
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-flow'),
    ],
  };
}
