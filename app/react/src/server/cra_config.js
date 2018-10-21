import semver from 'semver';
import { normalizeCondition } from 'webpack/lib/RuleSet';

export function isReactScriptsInstalled() {
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const reactScriptsJson = require('react-scripts/package.json');
    if (semver.lt(reactScriptsJson.version, '2.0.0')) return false;
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

export function getCraWebpackConfig(mode) {
  if (mode === 'production') {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    return require('react-scripts/config/webpack.config.prod');
  }

  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  return require('react-scripts/config/webpack.config.dev');
}

export function applyCRAWebpackConfig(baseConfig) {
  // Remove style rules from baseConfig
  const baseRulesExcludingStyles = baseConfig.module.rules.filter(
    rule => !rule.test || !['.css', '.scss', '.sass'].some(normalizeCondition(rule.test))
  );

  //  Load create-react-app config
  const craWebpackConfig = getCraWebpackConfig(baseConfig.mode);

  //  Concat will ensure rules is an array
  const craStyleRules = getStyleRules([].concat(craWebpackConfig.module.rules));

  //  Add css minification for production
  const plugins = [...baseConfig.plugins];
  if (baseConfig.mode === 'production') {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    plugins.push(
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      })
    );
  }

  return {
    ...baseConfig,
    module: {
      ...baseConfig.module,
      rules: [...baseRulesExcludingStyles, ...craStyleRules],
    },
    plugins,
  };
}
