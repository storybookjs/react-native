import lineColumn from 'line-column';
import { handleADD, handleSTORYOF } from './parse-helpers';

const acorn = require('acorn-stage3/inject')(require('acorn-jsx'));
const estraverse = require('estraverse');

const acornConfig = {
  ecmaVersion: '6',
  sourceType: 'module',
  plugins: {
    jsx: true,
    stage3: true,
  },
};

function calculateLocations(source, adds) {
  const addsKeys = Object.keys(adds);

  if (addsKeys.length > 0) {
    const lineColumnFinder = lineColumn(source);

    Object.keys(adds).forEach(key => {
      const value = adds[key];
      value.startLoc = lineColumnFinder.fromIndex(value.start);
      value.endLoc = lineColumnFinder.fromIndex(value.end);
    });
  }
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

  calculateLocations(source, adds);

  const newSource = parts.join(decorator);

  return {
    changed: lastIndex > 0,
    source: newSource,
    addsMap: adds,
  };
}

export default inject;
