import lineColumn from 'line-column';

const acorn = require('acorn-stage3/inject')(require('acorn-jsx'));
const estraverse = require('estraverse');

const ADD_DECORATOR_STATEMENT = '.addDecorator(withStorySource(__STORY__, __ADDS_MAP__))';

const acornConfig = {
  ecmaVersion: '6',
  sourceType: 'module',
  plugins: {
    jsx: true,
    stage3: true,
  },
};

function pushParts(source, parts, from, to) {
  const start = source.slice(from, to);
  parts.push(start);

  const end = source.slice(to);
  parts.push(end);
}

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

function handleADD(node, parent, adds) {
  if (!node.property || !node.property.name || node.property.name.indexOf('add') !== 0) {
    return;
  }

  const addArgs = parent.arguments;

  if (!addArgs || addArgs.length < 2) {
    return;
  }

  const storyName = addArgs[0];
  const lastArg = addArgs[addArgs.length - 1];

  if (storyName.type === 'Literal') {
    // eslint-disable-next-line no-param-reassign
    adds[storyName.value] = {
      // Debug: code: source.slice(storyName.start, lastArg.end),
      start: storyName.start,
      end: lastArg.end,
    };
  }
}

function handleSTORYOF(node, parts, source, lastIndex) {
  if (!node.callee || !node.callee.name || node.callee.name !== 'storiesOf') {
    return lastIndex;
  }

  parts.pop();
  pushParts(source, parts, lastIndex, node.end);
  return node.end;
}

function inject(source) {
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

  const newSource = parts.join(ADD_DECORATOR_STATEMENT);

  return {
    changed: lastIndex > 0,
    source: newSource,
    addsMap: adds,
  };
}

export default inject;
