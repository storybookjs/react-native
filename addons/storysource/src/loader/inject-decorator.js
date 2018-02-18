import lineColumn from 'line-column';
import { handleADD, handleSTORYOF } from './parse-helpers';

const estraverse = require('estraverse');
const acorn = require('acorn');

require('acorn-stage3/inject')(acorn);
require('acorn-jsx/inject')(acorn);
require('acorn-es7')(acorn);

const acornConfig = {
  ecmaVersion: '9',
  sourceType: 'module',
  plugins: {
    jsx: true,
    stage3: true,
    es7: true,
  },
};

function calculateLocations(source, adds) {
  const addsKeys = Object.keys(adds);

  if (!addsKeys.length) {
    return {};
  }

  const lineColumnFinder = lineColumn(source);

  return addsKeys.reduce((map, key) => {
    const value = adds[key];

    // eslint-disable-next-line no-param-reassign
    map[key] = {
      startLoc: lineColumnFinder.fromIndex(value.start),
      endLoc: lineColumnFinder.fromIndex(value.end),
    };

    return map;
  }, {});
}

function inject(source, decorator) {
  const ast = acorn.parse(source, acornConfig);

  let lastIndex = 0;
  const parts = [source];
  const adds = {};

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: (node, parent) => {
      if (node.type === 'MemberExpression') {
        handleADD(node, parent, adds);
      }

      if (node.type === 'CallExpression') {
        lastIndex = handleSTORYOF(node, parts, source, lastIndex);
      }
    },
  });

  const addsMap = calculateLocations(source, adds);
  const newSource = parts.join(decorator);

  return {
    changed: lastIndex > 0,
    source: newSource,
    addsMap,
  };
}

export default inject;
