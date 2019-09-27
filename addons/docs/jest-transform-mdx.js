const mdx = require('@mdx-js/mdx');
const babel = require('babel-jest');
const createCompiler = require('./mdx-compiler-plugin');

const compilers = [createCompiler({})];

module.exports = {
  process(src, filename, config, options) {
    let result = mdx.sync(src, { compilers, filepath: filename });

    result = `/* @jsx mdx */
    import React from 'react'
    import { mdx } from '@mdx-js/react'
    ${result}
    `;

    return babel.process(result, filename, config, options);
  },
};
