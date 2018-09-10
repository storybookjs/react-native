export function babelDefault(config) {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-flow'),
    ],
  };
}
