/* eslint-disable import/no-extraneous-dependencies,global-require */
let babelCore = null;

try {
  babelCore = require('@babel/core');
} catch (e) {
  babelCore = require('babel-core');
}

module.exports = babelCore;
