function createProdPresets() {
  return [
    [
      require.resolve('babel-preset-minify'),
      {
        builtIns: false,
        mangle: false,
      },
    ],
  ];
}

export default ({ configType }) => {
  const isProd = configType === 'PRODUCTION';
  const prodPresets = isProd ? createProdPresets() : [];

  return {
    presets: [
      [require.resolve('@babel/preset-env'), { shippedProposals: true, useBuiltIns: 'usage' }],
      ...prodPresets,
    ],
    plugins: [
      require.resolve('babel-plugin-macros'),
      require.resolve('@babel/plugin-proposal-class-properties'),
    ],
  };
};
