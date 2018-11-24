import { logger } from '@storybook/node-logger';
import { applyCRAWebpackConfig, isReactScriptsInstalled } from './cra-config';

export function webpackFinal(config) {
  if (!isReactScriptsInstalled()) {
    logger.info('=> Using base config because react-scripts is not installed.');
    return config;
  }

  logger.info('=> Loading create-react-app config.');

  return applyCRAWebpackConfig(config);
}

export function babelDefault(config) {
  if (!isReactScriptsInstalled()) {
    return config;
  }

  return {
    ...config,
    plugins: [
      ...config.plugins,
      require.resolve('@babel/plugin-syntax-dynamic-import'),
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
