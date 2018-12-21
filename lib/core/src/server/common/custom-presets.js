import path from 'path';
import { logger } from '@storybook/node-logger';
import serverRequire from '../utils/server-require';

export default function loadCustomPresets({ configDir }) {
  const presets = serverRequire(path.resolve(configDir, 'presets'));

  if (presets) {
    logger.warn(
      '"Custom presets" is an experimental and undocumented feature that will be changed or deprecated soon. Use it on your own risk.'
    );

    return presets;
  }

  return [];
}
