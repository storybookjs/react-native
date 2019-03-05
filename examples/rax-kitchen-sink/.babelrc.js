module.exports = {
  presets: [
    ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage' }],
    ['babel-preset-rax', { development: process.env.BABEL_ENV === 'development' }],
  ],
};
