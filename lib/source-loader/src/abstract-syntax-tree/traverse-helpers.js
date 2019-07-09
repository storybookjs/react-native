import { handleADD, handleSTORYOF, patchNode, handleExportedName } from './parse-helpers';

const estraverse = require('estraverse');

export function splitSTORYOF(ast, source) {
  let lastIndex = 0;
  const parts = [source];

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: node => {
      patchNode(node);

      if (node.type === 'CallExpression') {
        lastIndex = handleSTORYOF(node, parts, source, lastIndex);
      }
    },
  });

  return parts;
}
export function splitExports(ast, source) {
  const parts = [];
  let lastIndex = 0;

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: node => {
      patchNode(node);
      if (
        node.type === 'ExportNamedDeclaration' &&
        node.declaration &&
        node.declaration.declarations &&
        node.declaration.declarations.length === 1 &&
        node.declaration.declarations[0].type === 'VariableDeclarator' &&
        node.declaration.declarations[0].id &&
        node.declaration.declarations[0].id.name &&
        node.declaration.declarations[0].init &&
        ['CallExpression', 'ArrowFunctionExpression', 'FunctionExpression'].includes(
          node.declaration.declarations[0].init.type
        )
      ) {
        const functionNode = node.declaration.declarations[0].init;
        parts.push(source.substring(lastIndex, functionNode.start - 1));
        parts.push(source.substring(functionNode.start, functionNode.end));
        lastIndex = functionNode.end;
      }
    },
  });

  if (source.length > lastIndex + 1) parts.push(source.substring(lastIndex + 1));
  if (parts.length === 1) return [source];
  return parts;
}

export function findAddsMap(ast, storiesOfIdentifiers) {
  const addsMap = {};
  const idsToFrameworks = {};

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: (node, parent) => {
      patchNode(node);

      if (node.type === 'MemberExpression') {
        const { toAdd, idToFramework } = handleADD(node, parent, storiesOfIdentifiers);
        Object.assign(addsMap, toAdd);
        Object.assign(idsToFrameworks, idToFramework);
      }
    },
  });

  return { addsMap, idsToFrameworks };
}

// Handle cases like:
//   export const withText = () => <Button />;
//   withText.story = { name: 'with text' };
function findStoryTitle(storyVar, ast) {
  const titleAssignment = ast.program.body.find(
    d =>
      d.type === 'ExpressionStatement' &&
      d.expression &&
      d.expression.type === 'AssignmentExpression' &&
      d.expression.left &&
      d.expression.left.type === 'MemberExpression' &&
      d.expression.left.object &&
      d.expression.left.object.type === 'Identifier' &&
      d.expression.left.object.name === storyVar &&
      d.expression.left.property.type === 'Identifier' &&
      d.expression.left.property.name === 'story' &&
      d.expression.right &&
      d.expression.right.type === 'ObjectExpression'
  );
  const nameProp =
    titleAssignment &&
    titleAssignment.expression.right.properties.find(
      prop =>
        prop.key.type === 'Identifier' &&
        prop.key.name === 'name' &&
        prop.value.type === 'StringLiteral'
    );

  return nameProp && nameProp.value.value;
}

export function findExportsMap(ast) {
  const addsMap = {};
  const idsToFrameworks = {};
  const metaDeclaration =
    ast &&
    ast.program &&
    ast.program.body &&
    ast.program.body.find(
      d =>
        d.type === 'ExportDefaultDeclaration' &&
        d.declaration.type === 'ObjectExpression' &&
        (d.declaration.properties || []).length
    );

  const titleProperty =
    metaDeclaration &&
    metaDeclaration.declaration &&
    metaDeclaration.declaration.properties.find(p => p.key && p.key.name === 'title');

  if (!titleProperty) {
    return { addsMap, idsToFrameworks };
  }
  const title = titleProperty.value.value;

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: node => {
      patchNode(node);
      if (
        node.type === 'ExportNamedDeclaration' &&
        node.declaration &&
        node.declaration.declarations &&
        node.declaration.declarations.length === 1 &&
        node.declaration.declarations[0].type === 'VariableDeclarator' &&
        node.declaration.declarations[0].id &&
        node.declaration.declarations[0].id.name &&
        node.declaration.declarations[0].init &&
        ['CallExpression', 'ArrowFunctionExpression', 'FunctionExpression'].includes(
          node.declaration.declarations[0].init.type
        )
      ) {
        let storyName = node.declaration.declarations[0].id.name;
        storyName = findStoryTitle(storyName, ast) || storyName;
        const toAdd = handleExportedName(title, storyName, node.declaration.declarations[0].init);
        Object.assign(addsMap, toAdd);
      }
    },
  });
  return { addsMap, idsToFrameworks };
}

export function findDependencies(ast) {
  const dependencies = [];
  const storiesOfIdentifiers = {};

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: node => {
      patchNode(node);

      if (node.type === 'ImportDeclaration') {
        const candidateSpecifier = (node.specifiers || []).find(
          s => (s.imported || {}).name === 'storiesOf'
        );
        if (node.source.value.startsWith('@storybook/') && candidateSpecifier) {
          Object.assign(storiesOfIdentifiers, {
            [candidateSpecifier.local.name]: node.source.value,
          });
        }
        dependencies.push(node.source.value);
      }
    },
  });
  return { dependencies, storiesOfIdentifiers };
}

export function popParametersObjectFromDefaultExport(source, ast) {
  let splicedSource = source;
  let parametersSliceOfCode = '';
  let indexWhereToAppend = -1;
  let foundParametersProperty = false;
  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: node => {
      patchNode(node);

      if (
        node.type === 'ExportDefaultDeclaration' &&
        node.declaration.type === 'ObjectExpression' &&
        (node.declaration.properties || []).length
      ) {
        const parametersProperty = node.declaration.properties.find(
          p => p.key.name === 'parameters' && p.value.type === 'ObjectExpression'
        );

        foundParametersProperty = !!parametersProperty;

        splicedSource = parametersProperty
          ? source.substring(0, parametersProperty.value.start) +
            source.substring(parametersProperty.value.end + 1)
          : splicedSource;

        parametersSliceOfCode = parametersProperty
          ? source.substring(parametersProperty.value.start, parametersProperty.value.end)
          : '{}';

        indexWhereToAppend = parametersProperty
          ? parametersProperty.value.start
          : node.declaration.start + 1;
      }
    },
  });
  return { splicedSource, parametersSliceOfCode, indexWhereToAppend, foundParametersProperty };
}
