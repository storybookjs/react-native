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
      [
        require.resolve('@babel/preset-env'),
        { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' },
      ],
      ...prodPresets,
    ],
    plugins: [
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      require.resolve('@babel/plugin-proposal-class-properties'),
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      [require.resolve('babel-plugin-emotion'), { sourceMap: true, autoLabel: true }],
      require.resolve('babel-plugin-macros'),
    ],
  };
};
