const mdx = require('@mdx-js/mdx');
const babel = require('babel-jest');
const deasyncPromise = require('deasync-promise');
const createCompiler = require('./mdx-compiler-plugin');

const compilers = [createCompiler({})];

module.exports = {
  process(src, filename, config, options) {
    let result = deasyncPromise(mdx(src, { compilers, filepath: filename }));

    result = `/* @jsx mdx */
    import React from 'react'
    import { mdx } from '@mdx-js/react'
    ${result}
    `;

    return babel.process(result, filename, config, options);
  },
};
