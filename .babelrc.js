module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-stage-0', '@babel/preset-react'],
  plugins: [
    'emotion',
    'babel-plugin-macros',
    [
      '@babel/plugin-transform-runtime',
      {
        polyfill: false,
        regenerator: true,
      },
    ],
  ],
};
