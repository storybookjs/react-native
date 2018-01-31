const path = require('path');

module.exports = baseConfig => {
  const originJsRule = baseConfig.module.rules.find(rule => rule.test.test('text.js'));

  if (originJsRule) {
    originJsRule.exclude.push(/\.stories\.jsx?$/);
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
    loaders: [require.resolve('babel-loader'), require.resolve('@storybook/addon-stories/loader')],
    include: [
      path.resolve(__dirname, './stories'),
      path.resolve(__dirname, '../../lib/ui/src'),
      path.resolve(__dirname, '../../lib/components/src'),
    ],
  });

  return baseConfig;
};
