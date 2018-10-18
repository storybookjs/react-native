import { logger } from '@storybook/node-logger';

// eslint-disable-next-line import/no-extraneous-dependencies
const { normalizeCondition } = require('webpack/lib/RuleSet');

export function isReactScriptsInstalled() {
  try {
    require.resolve('react-scripts/bin/react-scripts');
    return true;
  } catch (e) {
    return false;
  }
}

export function getStyleRules(rules) {
  // Extensions of style rules we're interested in
  const extensions = ['.css', '.scss', '.sass', '.module.css', '.module.scss', '.module.sass'];

  return rules.reduce((styleRules, rule) => {
    if (rule.test && extensions.some(normalizeCondition(rule.test))) {
      // If the base test is for styles, return early
      return styleRules.concat(rule);
    }

    if (!rule.test && rule.oneOf) {
      styleRules.push(...getStyleRules(rule.oneOf));
    }

    if (!rule.test && rule.rules) {
      styleRules.push(...getStyleRules(rule.rules));
    }

    return styleRules;
  }, []);
}

export function applyCRAWebpackConfig(baseConfig) {
  if (!isReactScriptsInstalled()) {
    logger.info('=> Using base config because react-scripts is not installed.');
    return baseConfig;
  }

  // Remove style rules from baseConfig
  const baseRulesExcludingStyles = baseConfig.module.rules.filter(
    rule => !rule.test || !['.css', '.scss', '.sass'].some(normalizeCondition(rule.test))
  );

  // TODO: Load based on NODE_ENV
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const craWebpackConfig = require('react-scripts/config/webpack.config.dev');
  //  Concat will ensure rules is an array
  const craStyleRules = getStyleRules([].concat(craWebpackConfig.module.rules));

  return {
    ...baseConfig,
    module: {
      ...baseConfig.module,
      rules: [...baseRulesExcludingStyles, ...craStyleRules],
    },
  };
}
