import path from 'path';
import { getInterpretedFile } from './interpret-files';

function loadConfigFiles({ configDir }) {
  const storybookConfigPath = getInterpretedFile(path.resolve(configDir, 'config'));

  if (storybookConfigPath) {
    return [storybookConfigPath];
  }

  return [];
}

export default loadConfigFiles;
