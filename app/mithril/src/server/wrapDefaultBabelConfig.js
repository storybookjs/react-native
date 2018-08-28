export default config => ({
  ...config,
  plugins: [...config.plugins, require.resolve('@babel/plugin-transform-react-jsx')],
});
