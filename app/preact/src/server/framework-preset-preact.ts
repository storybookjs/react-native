export function babelDefault(config: any) {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }],
    ],
  };
}
