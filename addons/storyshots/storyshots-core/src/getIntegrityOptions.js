const ignore = ['**/node_modules/**'];

export default function getIntegrityOptions(options) {
  const { integrityOptions } = options;

  if (integrityOptions === false) {
    return false;
  }

  if (typeof integrityOptions !== 'object') {
    return false;
  }

  return {
    ...integrityOptions,
    ignore: [...ignore, ...(integrityOptions.ignore || [])],
    absolute: true,
  };
}
