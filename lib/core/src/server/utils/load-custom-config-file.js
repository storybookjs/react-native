import path from 'path';
import { getInterpretedFile } from './interpret-files';

function loadConfigFiles({ configDir }) {
  const storybookConfigPath = getInterpretedFile(path.resolve(configDir, 'config'));
  const storybookPreviewPath = getInterpretedFile(path.resolve(configDir, 'preview'));

  return [].concat(storybookPreviewPath || storybookConfigPath || []);
}

export default loadConfigFiles;
