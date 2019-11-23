import path from 'path';
import { logger } from '@storybook/node-logger';

export async function createPreviewEntry(options) {
  const { configDir, presets } = options;
  const entries = [require.resolve('../common/polyfills'), require.resolve('./globals')];

  const configs = await presets.apply('config', [], options);
  const stories = await presets.apply('stories', [], options);

  if (configs && configs.length) {
    logger.info(`=> Loading config/preview file in "${configDir}".`);
    entries.push(...configs);
  }

  if (stories && stories.length) {
    logger.info(`=> Adding stories defined in "${path.join(configDir, 'main.js')}".`);
    entries.push(path.resolve(path.join(configDir, `generated-entry.js`)));
  }

  return entries;
}
