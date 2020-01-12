import path from 'path';
import { Configuration } from 'webpack';
import { logger } from '@storybook/node-logger';
import { applyCRAWebpackConfig, getReactScriptsPath, isReactScriptsInstalled } from './cra-config';

type Preset = string | { name: string };

// Disable the built-in preset if the new preset is detected.
const checkForNewPreset = (presetsList: Preset[]) => {
  const hasNewPreset = presetsList.some((preset: Preset) => {
    const presetName = typeof preset === 'string' ? preset : preset.name;
    return presetName === '@storybook/preset-create-react-app';
  });

  if (!hasNewPreset) {
    logger.warn('Storybook support for Create React App is now a separate preset.');
    logger.warn(
      'To get started with the new preset, simply add `@storybook/preset-create-react-app` to your project.'
    );
    logger.warn('The built-in preset will be disabled in Storybook 6.0.');
    return false;
  }

  return true;
};

export function webpackFinal(
  config: Configuration,
  { presetsList, configDir }: { presetsList: Preset[]; configDir: string }
) {
  if (!isReactScriptsInstalled()) {
    logger.info('=> Using base config because react-scripts is not installed.');
    return config;
  }

  if (checkForNewPreset(presetsList)) {
    return config;
  }

  logger.info('=> Loading create-react-app config.');
  return applyCRAWebpackConfig(config, configDir);
}

export function managerWebpack(config: Configuration, { presetsList }: { presetsList: Preset[] }) {
  if (!isReactScriptsInstalled() || checkForNewPreset(presetsList)) {
    return config;
  }

  return {
    ...config,
    resolveLoader: {
      modules: ['node_modules', path.join(getReactScriptsPath(), 'node_modules')],
    },
  };
}

export function babelDefault(config: Configuration, { presetsList }: { presetsList: Preset[] }) {
  if (!isReactScriptsInstalled() || checkForNewPreset(presetsList)) {
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
