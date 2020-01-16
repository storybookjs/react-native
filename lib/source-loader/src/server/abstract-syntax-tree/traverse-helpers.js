import { storyNameFromExport, isExportStory } from '@storybook/csf';
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

function isFunctionVariable(declarations, includeExclude) {
  return (
    declarations &&
    declarations.length === 1 &&
    declarations[0].type === 'VariableDeclarator' &&
    declarations[0].id &&
    declarations[0].id.name &&
    declarations[0].init &&
    ['CallExpression', 'ArrowFunctionExpression', 'FunctionExpression'].includes(
      declarations[0].init.type
    ) &&
    isExportStory(declarations[0].id.name, includeExclude)
  );
}

function isFunctionDeclaration(declaration, includeExclude) {
  return (
    declaration.type === 'FunctionDeclaration' &&
    declaration.id &&
    declaration.id.name &&
    isExportStory(declaration.id.name, includeExclude)
  );
}

function getDescriptor(metaDeclaration, propertyName) {
  const property =
    metaDeclaration &&
    metaDeclaration.declaration &&
    metaDeclaration.declaration.properties.find(p => p.key && p.key.name === propertyName);
  if (!property) {
    return undefined;
  }

  const { type } = property.value;

  switch (type) {
    case 'ArrayExpression':
      return property.value.elements.map(t => {
        if (!['StringLiteral', 'Literal'].includes(t.type)) {
          throw new Error(`Unexpected descriptor element: ${t.type}`);
        }
        return t.value;
      });
    case 'Literal':
    case 'RegExpLiteral':
      return property.value.value;
    default:
      throw new Error(`Unexpected descriptor: ${type}`);
  }
}

function findIncludeExclude(ast) {
  const program = (ast && ast.program) || ast;
  const metaDeclaration =
    program &&
    program.body &&
    program.body.find(
      d =>
        d.type === 'ExportDefaultDeclaration' &&
        d.declaration.type === 'ObjectExpression' &&
        (d.declaration.properties || []).length
    );

  const includeStories = getDescriptor(metaDeclaration, 'includeStories');
  const excludeStories = getDescriptor(metaDeclaration, 'excludeStories');

  return {
    includeStories,
    excludeStories,
  };
}

export function splitExports(ast, source) {
  const parts = [];
  let lastIndex = 0;

  const includeExclude = findIncludeExclude(ast);

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: node => {
      patchNode(node);

      const isNamedExport = node.type === 'ExportNamedDeclaration' && node.declaration;

      const isFunctionVariableExport =
        isNamedExport && isFunctionVariable(node.declaration.declarations, includeExclude);
      const isFunctionDeclarationExport =
        isNamedExport && isFunctionDeclaration(node.declaration, includeExclude);

      if (isFunctionDeclarationExport || isFunctionVariableExport) {
        const functionNode = isFunctionVariableExport
          ? node.declaration.declarations[0].init
          : node.declaration;
        parts.push({
          source: source.substring(lastIndex, functionNode.start - 1),
        });
        parts.push({
          source: source.substring(functionNode.start, functionNode.end),
          declaration: {
            isVariableDeclaration: isFunctionVariableExport,
            ident: isFunctionVariableExport
              ? node.declaration.declarations[0].id.name
              : functionNode.id.name,
          },
        });
        lastIndex = functionNode.end;
      }
    },
  });

  if (source.length > lastIndex + 1) parts.push({ source: source.substring(lastIndex + 1) });
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

export function findExportsMap(ast) {
  const addsMap = {};
  const idsToFrameworks = {};
  const program = (ast && ast.program) || ast;
  const metaDeclaration =
    program &&
    program.body &&
    program.body.find(
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
  const titleValue = titleProperty.value;
  let title;
  if (titleValue.type === 'TemplateLiteral' && titleValue.quasis.length > 0) {
    // if a  tagged template string.
    title = titleValue.quasis[0].value.raw;
  } else {
    // if title is string: 'StringLiteral'
    title = titleProperty.value.value;
  }
  if (title) {
    estraverse.traverse(ast, {
      fallback: 'iteration',
      enter: node => {
        patchNode(node);

        const isNamedExport = node.type === 'ExportNamedDeclaration' && node.declaration;

        const isFunctionVariableExport =
          isNamedExport &&
          node.declaration.declarations &&
          node.declaration.declarations.length === 1 &&
          node.declaration.declarations[0].type === 'VariableDeclarator' &&
          node.declaration.declarations[0].id &&
          node.declaration.declarations[0].id.name &&
          node.declaration.declarations[0].init &&
          ['CallExpression', 'ArrowFunctionExpression', 'FunctionExpression'].includes(
            node.declaration.declarations[0].init.type
          );

        const isFunctionDeclarationExport =
          isNamedExport &&
          node.declaration.type === 'FunctionDeclaration' &&
          node.declaration.id &&
          node.declaration.id.name;

        if (isFunctionDeclarationExport || isFunctionVariableExport) {
          const exportDeclaration = isFunctionVariableExport
            ? node.declaration.declarations[0]
            : node.declaration;
          const storyName = storyNameFromExport(exportDeclaration.id.name);
          const toAdd = handleExportedName(
            title,
            storyName,
            exportDeclaration.init || exportDeclaration
          );
          Object.assign(addsMap, toAdd);
        }
      },
    });
  }
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
        if (foundParametersProperty) {
          patchNode(parametersProperty.value);
        } else {
          patchNode(node.declaration);
        }

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
