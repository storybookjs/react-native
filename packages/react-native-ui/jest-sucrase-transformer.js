const { transform } = require('sucrase');

const transforms = ['typescript', 'imports'];
const jsxTransforms = [...transforms, 'jsx'];

module.exports = {
  process(src, filename) {
    const result = transform(src, {
      transforms: /\.[jt]sx$/.test(filename) ? jsxTransforms : transforms,
      // Matches the `react-jsx` setting in the repo tsconfig.
      jsxRuntime: 'automatic',
      filePath: filename,
      sourceMapOptions: { compiledFilename: filename },
    });
    return { code: result.code, map: result.sourceMap };
  },
};
