const path = require('path');

module.exports = baseConfig => {
  const originalJsRule = baseConfig.module.rules.find(rule => rule.test.test('text.js'));

  if (originalJsRule) {
    originalJsRule.exclude.push(/\.stories\.jsx?$/);
  }

  baseConfig.module.rules.push({
    test: /\.jsx?$/,
    exclude: [/\.stories\.jsx?$/],
    loaders: [require.resolve('babel-loader')],
    include: [
      path.resolve(__dirname, '../../lib/ui/src'),
      path.resolve(__dirname, '../../lib/components/src'),
    ],
  });

  baseConfig.module.rules.push({
    test: /\.stories\.jsx?$/,
    loaders: [
      require.resolve('babel-loader'),
      require.resolve('@storybook/addon-storysource/loader'),
    ],
    include: [
      path.resolve(__dirname, './stories'),
      path.resolve(__dirname, '../../lib/ui/src'),
      path.resolve(__dirname, '../../lib/components/src'),
    ],
  });

  return baseConfig;
};
