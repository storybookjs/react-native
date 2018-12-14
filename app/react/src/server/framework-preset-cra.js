import { logger } from '@storybook/node-logger';
import { applyCRAWebpackConfig, isReactScriptsInstalled } from './cra-config';

export function webpackFinal(config, { configDir }) {
  if (!isReactScriptsInstalled()) {
    logger.info('=> Using base config because react-scripts is not installed.');
    return config;
  }

  logger.info('=> Loading create-react-app config.');

  return applyCRAWebpackConfig(config, configDir);
}

export function babelDefault(config) {
  if (!isReactScriptsInstalled()) {
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
