import path from 'path';
import { logger } from '@storybook/node-logger';
import { getInterpretedFile } from './interpret-files';

export default function getEntries(configDir, presets) {
  const iframe = [require.resolve('./polyfills'), require.resolve('./globals')];
  const manager = [require.resolve('./polyfills'), require.resolve('../../client/manager')];

  // Check whether a config.{ext} file exists inside the storybook
  // config directory and throw an error if it's not.
  const storybookConfigPath = getInterpretedFile(path.resolve(configDir, 'config'));
  if (!storybookConfigPath) {
    throw new Error(`=> Create a storybook config file in "${configDir}/config.{ext}".`);
  }

  iframe.push(require.resolve(storybookConfigPath));

  // Check whether addons.{ext} file exists inside the storybook.
  const storybookCustomAddonsPath = getInterpretedFile(path.resolve(configDir, 'addons'));
  if (storybookCustomAddonsPath) {
    logger.info('=> Loading custom addons config.');
    manager.unshift(storybookCustomAddonsPath);
  }

  return {
    iframe: presets.extendPreview(iframe),
    manager: presets.extendManager(manager),
  };
}
