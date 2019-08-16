import path from 'path';
import { Configuration } from 'webpack';
import { logger } from '@storybook/node-logger';
import { applyCRAWebpackConfig, getReactScriptsPath, isReactScriptsInstalled } from './cra-config';

type Preset = string | { name: string };

// Disable the built-in preset if the new preset is detected.
const checkForNewPreset = (configDir: string) => {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const presets = require(path.resolve(configDir, 'presets.js'));

    const hasNewPreset = presets.some((preset: Preset) => {
      const presetName = typeof preset === 'string' ? preset : preset.name;
      return presetName === '@storybook/preset-create-react-app';
    });

    return hasNewPreset;
  } catch (e) {
    return false;
  }
};

export function webpackFinal(config: Configuration, { configDir }: { configDir: string }) {
  if (checkForNewPreset(configDir)) {
    return config;
  }
  if (!isReactScriptsInstalled()) {
    logger.info('=> Using base config because react-scripts is not installed.');
    return config;
  }

  logger.info('=> Loading create-react-app config.');
  return applyCRAWebpackConfig(config, configDir);
}

export function managerWebpack(config: Configuration, { configDir }: { configDir: string }) {
  if (!isReactScriptsInstalled() || checkForNewPreset(configDir)) {
    return config;
  }

  return {
    ...config,
    resolveLoader: {
      modules: ['node_modules', path.join(getReactScriptsPath(), 'node_modules')],
    },
  };
}

export function babelDefault(config: Configuration, { configDir }: { configDir: string }) {
  if (!isReactScriptsInstalled() || checkForNewPreset(configDir)) {
    return config;
  }

  return {
    ...config,
    presets: [require.resolve('babel-preset-react-app')],
    plugins: [
      [
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: {
              ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
            },
          },
        },
      ],
    ],
  };
}
