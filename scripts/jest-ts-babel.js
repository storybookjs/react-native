const tsTransformer = require('jest-preset-angular/preprocessor');
const babelTransformer = require('babel-jest');

module.exports.process = function transform(src, path, config, transformOptions) {
  const tsResult = tsTransformer.process(src, path, config, transformOptions);
  const jsPath = path.replace('.ts', '.js');

  return babelTransformer.process(tsResult, jsPath, config, transformOptions);
};
