import prettier from 'prettier';
import { handleADD, handleSTORYOF } from './parse-helpers';

const estraverse = require('estraverse');
const acorn = require('acorn');

require('acorn-stage3/inject')(acorn);
require('acorn-jsx/inject')(acorn);
require('acorn-es7')(acorn);

const acornConfig = {
  ecmaVersion: '9',
  sourceType: 'module',
  ranges: true,
  locations: true,
  plugins: {
    jsx: true,
    stage3: true,
    es7: true,
  },
};

function isUglyComment(comment, uglyCommentsRegex) {
  return uglyCommentsRegex.some(regex => regex.test(comment));
}

function generateSourceWithoutUglyComments(source, { comments, uglyCommentsRegex }) {
  let lastIndex = 0;
  const parts = [source];

  comments
    .filter(comment => isUglyComment(comment.value.trim(), uglyCommentsRegex))
    .forEach(comment => {
      parts.pop();

      const start = source.slice(lastIndex, comment.start);
      const end = source.slice(comment.end);

      parts.push(start, end);
      lastIndex = comment.end;
    });

  return parts.join('');
}

function prettifyCode(source, { prettierConfig }) {
  return prettier.format(source, prettierConfig);
}

export function generateSourceWithDecorators(source, decorator) {
  const comments = [];

  const config = {
    ...acornConfig,
    onComment: comments,
  };

  const ast = acorn.parse(source, config);

  let lastIndex = 0;
  const parts = [source];

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: node => {
      if (node.type === 'CallExpression') {
        lastIndex = handleSTORYOF(node, parts, source, lastIndex);
      }
    },
  });

  const newSource = parts.join(decorator);

  return {
    changed: lastIndex > 0,
    source: newSource,
    comments,
  };
}

export function generateAddsMap(source) {
  const ast = acorn.parse(source, acornConfig);
  const adds = {};

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: (node, parent) => {
      if (node.type === 'MemberExpression') {
        handleADD(node, parent, adds);
      }
    },
  });

  return adds;
}

export function generateStorySource({ source, ...options }) {
  let storySource = source;

  storySource = generateSourceWithoutUglyComments(storySource, options);
  storySource = prettifyCode(storySource, options);

  return storySource;
}
