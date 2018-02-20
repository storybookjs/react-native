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

function generateSourceWithoutUglyComments(source, comments) {
  let lastIndex = 0;
  const parts = [source];

  const isUgly = comment => comment.value.trim().indexOf('eslint-') === 0;

  comments.filter(isUgly).forEach(comment => {
    parts.pop();

    const start = source.slice(lastIndex, comment.start);
    const end = source.slice(comment.end);

    parts.push(start, end);
    lastIndex = comment.end;
  });

  return parts.join('');
}

function prettifyCode(source) {
  return prettier.format(source, {
    printWidth: 120,
    tabWidth: 2,
    bracketSpacing: true,
    trailingComma: 'es5',
    singleQuote: true,
  });
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

export function generateStorySource({ source, comments }) {
  let storySource = source;

  storySource = generateSourceWithoutUglyComments(storySource, comments);
  storySource = prettifyCode(storySource);

  return storySource;
}
