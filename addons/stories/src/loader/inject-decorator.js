const acorn = require('acorn-stage3/inject')(require('acorn-jsx'));
const estraverse = require('estraverse');

const ADD_DECORATOR_STATEMENT = '.addDecorator(withStorySource(__STORY__))';

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

function inject(source) {
  const ast = acorn.parse(source, acornConfig);

  let lastIndex = 0;
  const parts = [source];

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: node => {
      if (node.type !== 'CallExpression') {
        return;
      }

      if (node.callee.name === 'storiesOf') {
        parts.pop();
        pushParts(source, parts, lastIndex, node.end);
        lastIndex = node.end;
      }
    },
  });

  const newSource = parts.join(ADD_DECORATOR_STATEMENT);

  return {
    changed: lastIndex > 0,
    source: newSource,
  };
}

export default inject;
