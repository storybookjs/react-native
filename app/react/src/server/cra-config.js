import fs from 'fs';
import path from 'path';
import semver from 'semver';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { normalizeCondition } from 'webpack/lib/RuleSet';

const cssExtensions = ['.css', '.scss', '.sass'];
const cssModuleExtensions = ['.module.css', '.module.scss', '.module.sass'];
const typeScriptExtensions = ['.ts', '.tsx'];

let reactScriptsPath;

export function getReactScriptsPath({ noCache } = {}) {
  if (reactScriptsPath && !noCache) return reactScriptsPath;

  const appDirectory = fs.realpathSync(process.cwd());
  const reactScriptsScriptPath = fs.realpathSync(
    path.join(appDirectory, '/node_modules/.bin/react-scripts')
  );

  reactScriptsPath = path.join(reactScriptsScriptPath, '../..');
  const scriptsPkgJson = path.join(reactScriptsPath, 'package.json');

  if (!fs.existsSync(scriptsPkgJson)) {
    reactScriptsPath = 'react-scripts';
  }

  return reactScriptsPath;
}

export function isReactScriptsInstalled(requiredVersion = '2.0.0') {
  try {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const reactScriptsJson = require(path.join(getReactScriptsPath(), 'package.json'));
    return !semver.lt(reactScriptsJson.version, requiredVersion);
  } catch (e) {
    return false;
  }
}

export const getRules = extensions => rules =>
  rules.reduce((craRules, rule) => {
    // If at least one extension satisfies the rule test, the rule is one
    // we want to extract
    if (rule.test && extensions.some(normalizeCondition(rule.test))) {
      // If the base test is for extensions, return early
      return craRules.concat(rule);
    }

    // Get any rules contained in rule.oneOf
    if (!rule.test && rule.oneOf) {
      craRules.push(...getRules(extensions)(rule.oneOf));
    }

    // Get any rules contained in rule.rules
    if (!rule.test && rule.rules) {
      craRules.push(...getRules(extensions)(rule.rules));
    }

    return craRules;
  }, []);

const getStyleRules = getRules(cssExtensions.concat(cssModuleExtensions));

export const getTypeScriptRules = (webpackConfigRules, configDir) => {
  const rules = getRules(typeScriptExtensions)(webpackConfigRules);
  // We know CRA only has one rule targetting TS for now, which is the first rule.
  const babelRule = rules[0];
  // Resolves an issue where this config is parsed twice (#4903).
  if (typeof babelRule.include !== 'string') return rules;
  // Adds support for using TypeScript in the `.storybook` (or config) folder.
  return [
    {
      ...babelRule,
      include: [babelRule.include, path.resolve(configDir)],
    },
    ...rules.slice(1),
  ];
};

function mergePlugins(basePlugins, additionalPlugins) {
  return [...basePlugins, ...additionalPlugins].reduce((plugins, plugin) => {
    if (
      plugins.some(includedPlugin => includedPlugin.constructor.name === plugin.constructor.name)
    ) {
      return plugins;
    }
    return [...plugins, plugin];
  }, []);
}

export function getCraWebpackConfig(mode) {
  const pathToReactScripts = getReactScriptsPath();

  const craWebpackConfig =
    mode === 'production' ? 'config/webpack.config.prod.js' : 'config/webpack.config.dev.js';

  let pathToWebpackConfig = path.join(pathToReactScripts, craWebpackConfig);

  if (!fs.existsSync(pathToWebpackConfig)) {
    pathToWebpackConfig = path.join(pathToReactScripts, 'config/webpack.config.js');
  }

  // eslint-disable-next-line import/no-dynamic-require,global-require
  const webpackConfig = require(pathToWebpackConfig);

  if (typeof webpackConfig === 'function') {
    return webpackConfig(mode);
  }

  return webpackConfig;
}

export function applyCRAWebpackConfig(baseConfig, configDir) {
  // Check if the user can use TypeScript (react-scripts version 2.1+).
  const hasTsSupport = isReactScriptsInstalled('2.1.0');

  const tsExtensions = hasTsSupport ? typeScriptExtensions : [];
  const extensions = [...cssExtensions, ...tsExtensions];

  // Remove any rules from baseConfig that test true for any one of the extensions
  const filteredBaseRules = baseConfig.module.rules.filter(
    rule => !rule.test || !extensions.some(normalizeCondition(rule.test))
  );

  //  Load create-react-app config
  const craWebpackConfig = getCraWebpackConfig(baseConfig.mode);

  const craStyleRules = getStyleRules(craWebpackConfig.module.rules);
  const craTypeScriptRules = hasTsSupport
    ? getTypeScriptRules(craWebpackConfig.module.rules, configDir)
    : [];

  //  Add css minification for production
  const plugins = [...baseConfig.plugins];
  if (baseConfig.mode === 'production') {
    plugins.push(new MiniCssExtractPlugin());
  }

  return {
    ...baseConfig,
    module: {
      ...baseConfig.module,
      rules: [...filteredBaseRules, ...craStyleRules, ...craTypeScriptRules],
    },
    plugins: mergePlugins(plugins, hasTsSupport ? craWebpackConfig.plugins : []),
    resolve: {
      ...baseConfig.resolve,
      extensions: [...baseConfig.resolve.extensions, ...tsExtensions],
    },
  };
}
