import { addPreset } from '../codemods';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  addPreset('test', null, { root, api });

  return root.toSource();
}
