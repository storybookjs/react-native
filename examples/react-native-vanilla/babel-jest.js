const path = require('path');
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  babelrc: false,
  extends: path.resolve(__dirname, '.babelrc'),
});
