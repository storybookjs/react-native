import path from 'path';
import serverRequire from '../utils/server-require';

export default function loadCustomPresets({ configDir }) {
  const presets = serverRequire(path.resolve(configDir, 'presets'));
  return presets || [];
}
