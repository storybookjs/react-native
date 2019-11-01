import fs from 'fs';
import path from 'path';
import semver from 'semver';
import { Configuration, Plugin, RuleSetRule } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { normalizeCondition } from 'webpack/lib/RuleSet';
import { logger } from '@storybook/node-logger';

const JSCONFIG = 'jsconfig.json';
const TSCONFIG = 'tsconfig.json';

const appDirectory = fs.realpathSync(process.cwd());
const cssExtensions = ['.css', '.scss', '.sass'];
const cssModuleExtensions = ['.module.css', '.module.scss', '.module.sass'];
const typeScriptExtensions = ['.ts', '.tsx'];

let reactScriptsPath: string;

export function getReactScriptsPath({ noCache }: { noCache?: boolean } = {}) {
  if (reactScriptsPath && !noCache) return reactScriptsPath;

  let reactScriptsScriptPath = fs.realpathSync(
    path.join(appDirectory, '/node_modules/.bin/react-scripts')
  );

  try {
    // Note: Since there is no symlink for .bin/react-scripts on Windows
    // we'll parse react-scripts file to find actual package path.
    // This is important if you use fork of CRA.

    const pathIsNotResolved = /node_modules[\\/]\.bin[\\/]react-scripts/i.test(
      reactScriptsScriptPath
    );

    if (pathIsNotResolved) {
      const content = fs.readFileSync(reactScriptsScriptPath, 'utf8');
      const packagePathMatch = content.match(
        /"\$basedir[\\/]([^\s]+?[\\/]bin[\\/]react-scripts\.js")/i
      );

      if (packagePathMatch && packagePathMatch.length > 1) {
        reactScriptsScriptPath = path.join(
          appDirectory,
          '/node_modules/.bin/',
          packagePathMatch[1]
        );
      }
    }
  } catch (e) {
    logger.warn(`Error occurred during react-scripts package path resolving: ${e}`);
  }

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
    return !semver.gtr(requiredVersion, reactScriptsJson.version);
  } catch (e) {
    return false;
  }
}

export const getRules = (extensions: string[]) => (rules: RuleSetRule[]) =>
  rules.reduce(
    (craRules, rule) => {
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
    },
    [] as RuleSetRule[]
  );

const getStyleRules = getRules(cssExtensions.concat(cssModuleExtensions));

export const getTypeScriptRules = (webpackConfigRules: RuleSetRule[], configDir: string) => {
  const rules = getRules(typeScriptExtensions)(webpackConfigRules);

  // Adds support for using TypeScript in the `.storybook` (or config) folder.
  return rules.reduce(
    (accRules, rule) => {
      // Resolves an issue where this config is parsed twice (#4903).
      if (typeof rule.include !== 'string') {
        return [...accRules, rule];
      }

      return [
        ...accRules,
        {
          ...rule,
          include: [rule.include, path.resolve(configDir)],
        },
      ];
    },
    [] as RuleSetRule[]
  );
};

export const getModulePath = () => {
  // As with CRA, we only support `jsconfig.json` if `tsconfig.json` doesn't exist.
  let configName;
  if (fs.existsSync(path.join(appDirectory, TSCONFIG))) {
    configName = TSCONFIG;
  } else if (fs.existsSync(path.join(appDirectory, JSCONFIG))) {
    configName = JSCONFIG;
  }

  if (configName) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const config = require(path.join(appDirectory, configName));
    return config.compilerOptions && config.compilerOptions.baseUrl;
  }
  return false;
};

function mergePlugins(basePlugins: Plugin[], additionalPlugins: Plugin[]) {
  return [...basePlugins, ...additionalPlugins].reduce((plugins, plugin) => {
    if (
      plugins.some(includedPlugin => includedPlugin.constructor.name === plugin.constructor.name)
    ) {
      return plugins;
    }
    return [...plugins, plugin];
  }, []);
}

export function getCraWebpackConfig(mode: 'development' | 'production' | 'none') {
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

export function applyCRAWebpackConfig(baseConfig: Configuration, configDir: string): Configuration {
  // Check if the user can use TypeScript (react-scripts version 2.1+).
  const hasTsSupport = isReactScriptsInstalled('2.1.0');

  const tsExtensions = hasTsSupport ? typeScriptExtensions : [];
  const extensions = [...cssExtensions, ...tsExtensions];

  // Support for this was added in `react-scripts@3.0.0`.
  // https://github.com/facebook/create-react-app/pull/6656
  const modulePath = isReactScriptsInstalled('3.0.0') && getModulePath();

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
      modules: baseConfig.resolve.modules.concat(modulePath || []),
    },
    resolveLoader: {
      modules: ['node_modules', path.join(getReactScriptsPath(), 'node_modules')],
    },
  };
}
