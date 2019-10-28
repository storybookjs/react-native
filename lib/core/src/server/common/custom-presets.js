import path from 'path';
import serverRequire from '../utils/server-require';

export default function loadCustomPresets({ configDir }) {
  const presets = serverRequire(path.resolve(configDir, 'presets'));
  const main = serverRequire(path.resolve(configDir, 'main'));

  return []
    .concat(presets || [])
    .concat(main ? main.presets || [] : [])
    .concat(main || []);
}
