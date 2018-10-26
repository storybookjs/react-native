export default ({ configType }) => {
  const isProd = configType === 'PRODUCTION';

  return {
    presets: [[require.resolve('@babel/preset-env')]],
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
      isProd
        ? [
            require.resolve('babel-preset-minify'),
            {
              builtIns: false,
              mangle: false,
            },
          ]
        : null,
    ].filter(Boolean),
  };
};
