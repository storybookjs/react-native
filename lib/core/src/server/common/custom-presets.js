import path from 'path';
import dedent from 'ts-dedent';
import serverRequire from '../utils/server-require';

const toArray = a => (a ? [].concat(a) : a);

export default function loadCustomPresets({ configDir }) {
  const presets = serverRequire(path.resolve(configDir, 'presets'));
  const main = serverRequire(path.resolve(configDir, 'main'));

  if (presets && main) {
    throw new Error(dedent`
      You have both a "main.js" and a "presets.js", remove the "presets.js" file from your configDir (${path.resolve(
        configDir,
        'presets'
      )})`);
  }

  return [...(toArray(main ? main.presets : presets) || [])];
}
