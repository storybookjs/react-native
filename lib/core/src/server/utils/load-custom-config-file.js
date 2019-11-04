import path from 'path';
import dedent from 'ts-dedent';

import { getInterpretedFile } from './interpret-files';

const toArray = a => (a ? [a] : a);

function loadConfigFiles({ configDir }) {
  const storybookConfigPath = getInterpretedFile(path.resolve(configDir, 'config'));
  const storybookPreviewPath = getInterpretedFile(path.resolve(configDir, 'preview'));

  if (storybookConfigPath && storybookPreviewPath) {
    throw new Error(dedent`
      You have both a "config.js" and a "preview.js", remove the "config.js" file from your configDir (${path.resolve(
        configDir,
        'config'
      )})`);
  }

  return [...(toArray(storybookPreviewPath) || toArray(storybookConfigPath) || [])];
}

export default loadConfigFiles;
