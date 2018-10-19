import { logger } from '@storybook/node-logger';

let MiniCssExtractPlugin;
let normalizeCondition;

export function isReactScriptsInstalled() {
  try {
    require.resolve('react-scripts/bin/react-scripts');
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies, prefer-destructuring
    normalizeCondition = require('webpack/lib/RuleSet').normalizeCondition;
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    MiniCssExtractPlugin = require('mini-css-extract-plugin');
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

  logger.info('=> Loading create-react-app config.');

  // Remove style rules from baseConfig
  const baseRulesExcludingStyles = baseConfig.module.rules.filter(
    rule => !rule.test || !['.css', '.scss', '.sass'].some(normalizeCondition(rule.test))
  );

  let craWebpackConfig;
  if (baseConfig.mode === 'production') {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    craWebpackConfig = require('react-scripts/config/webpack.config.prod');
  } else {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    craWebpackConfig = require('react-scripts/config/webpack.config.dev');
  }

  //  Concat will ensure rules is an array
  const craStyleRules = getStyleRules([].concat(craWebpackConfig.module.rules));

  //  Add css minification for production
  const plugins = [...baseConfig.plugins];
  if (baseConfig.mode === 'production')
    plugins.push(
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      })
    );

  return {
    ...baseConfig,
    module: {
      ...baseConfig.module,
      rules: [...baseRulesExcludingStyles, ...craStyleRules],
    },
    plugins,
  };
}
