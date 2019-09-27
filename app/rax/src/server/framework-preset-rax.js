export function babelDefault(config) {
  return {
    ...config,
    presets: [
      ...config.presets,
      [
        require.resolve('babel-preset-rax'),
        { development: process.env.BABEL_ENV === 'development' },
      ],
    ],
  };
}
