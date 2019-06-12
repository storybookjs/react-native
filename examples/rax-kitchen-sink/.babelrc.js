module.exports = {
  presets: [
    ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' }],
    ['babel-preset-rax', { development: process.env.BABEL_ENV === 'development' }],
  ],
};
