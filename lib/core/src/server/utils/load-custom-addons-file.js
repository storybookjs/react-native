import path from 'path';
import { logger } from '@storybook/node-logger';

import { getInterpretedFile } from './interpret-files';

function loadCustomAddons({ configDir }) {
  const storybookCustomAddonsPath = getInterpretedFile(path.resolve(configDir, 'addons'));
  const storybookCustomManagerPath = getInterpretedFile(path.resolve(configDir, 'manager'));

  if (storybookCustomAddonsPath || storybookCustomManagerPath) {
    logger.info('=> Loading custom addons config.');
  }

  return [].concat(storybookCustomAddonsPath || []).concat(storybookCustomManagerPath || []);
}

export default loadCustomAddons;
