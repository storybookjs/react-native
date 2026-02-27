const { transform } = require('sucrase');

module.exports = {
  process(src, filename) {
    const result = transform(src, {
      transforms: ['imports'],
      filePath: filename,
      sourceMapOptions: { compiledFilename: filename },
    });
    return { code: result.code, map: result.sourceMap };
  },
};
