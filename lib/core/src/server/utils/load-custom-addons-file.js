import path from 'path';
import { logger } from '@storybook/node-logger';

import { getInterpretedFile } from './interpret-files';

function loadCustomAddons({ configDir }) {
  const storybookCustomAddonsPath = getInterpretedFile(path.resolve(configDir, 'addons'));

  if (storybookCustomAddonsPath) {
    logger.info('=> Loading custom addons config.');
    return [storybookCustomAddonsPath];
  }

  return [];
}

export default loadCustomAddons;
