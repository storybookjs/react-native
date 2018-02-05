const path = require('path');

module.exports = (baseConfig) => {
  debugger;
  const originalTsRule = baseConfig.module.rules.find(rule => rule.test.test('text.ts'));

  if (originalTsRule) {
    originalTsRule.exclude = [/\.stories\.tsx?$/];
  }

  baseConfig.module.rules.push({
    test: [
      /\.stories\.tsx?$/,
      /index\.ts$/
    ],
    loaders: [ ...originalTsRule.loaders, require.resolve('@storybook/addon-storysource/loader') ],
    include: [
      path.resolve(__dirname, '../src')
    ],
  });

  return baseConfig;
};
