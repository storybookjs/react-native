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
      [require.resolve('@babel/preset-env'), { shippedProposals: true, useBuiltins: 'usage' }],
      ...prodPresets,
    ],
    plugins: [
      require.resolve('babel-plugin-macros'),
      require.resolve('@babel/plugin-transform-regenerator'),
      require.resolve('@babel/plugin-proposal-class-properties'),
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          helpers: true,
          regenerator: true,
        },
      ],
    ],
  };
};
