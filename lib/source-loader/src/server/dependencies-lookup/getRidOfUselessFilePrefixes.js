import path from 'path';

function commonDir(...resources) {
  const firstResource = (resources[0] || '').split(path.sep);
  let i = 1;
  while (
    i < firstResource.length &&
    // eslint-disable-next-line no-loop-func
    resources.every(resource => resource.startsWith(firstResource.slice(0, i).join(path.sep)))
  ) {
    i += 1;
  }
  return firstResource.slice(0, i - 1).join(path.sep);
}

export function getRidOfUselessFilePrefixes({
  resource,
  source,
  sourceJson,
  addsMap,
  dependencies,
  localDependencies,
  idsToFrameworks,
}) {
  const commondir = commonDir(resource, ...Object.keys(localDependencies || {}));
  return {
    prefix: commondir,
    source,
    sourceJson,
    addsMap,
    dependencies,
    idsToFrameworks,
    resource:
      commondir === resource
        ? '/index.js'
        : resource.substring(commondir.length).replace(path.sep === '\\' ? /\\/g : /\//g, '/'),
    localDependencies: Object.assign(
      {},
      ...Object.entries(localDependencies || {}).map(([depFileName, dependency]) => ({
        [depFileName
          .substring(commondir.length)
          .replace(new RegExp(path.sep === '\\' ? /\\/g : /\//g, 'g'), '/')]: dependency,
      }))
    ),
  };
}
