const path = require('path');
const mdx = require('@mdx-js/mdx');
const { ScriptTransformer } = require('@jest/transform');
const { dedent } = require('ts-dedent');

const createCompiler = require('./mdx-compiler-plugin');

const compilers = [createCompiler({})];

const getNextTransformer = (filename, config) => {
  const extension = path.extname(filename);
  const jsFileName = `${filename.slice(0, -extension.length)}.js`;
  const self = config.transform.find(([pattern]) => new RegExp(pattern).test(filename));
  const jsTransforms = config.transform.filter(([pattern]) => new RegExp(pattern).test(jsFileName));
  return new ScriptTransformer({
    ...config,
    transform: [
      ...config.transform.filter(entry => entry !== self),
      ...jsTransforms.map(([pattern, ...rest]) => [self[0], ...rest]),
    ],
  });
};

module.exports = {
  process(src, filename, config, { instrument }) {
    const result = dedent`
      /* @jsx mdx */
      import React from 'react'
      import { mdx } from '@mdx-js/react'
      ${mdx.sync(src, { compilers, filepath: filename })}
    `;
    return getNextTransformer(filename, config).transformSource(filename, result, instrument);
  },
};
