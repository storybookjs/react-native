import { stat } from 'fs';

/**
 * Convert a legacy story file to module format
 *
 * For example:
 *
 * ```
 * input { Button } from './Button';
 * storiesOf('Button', module).add('story', () => <Button label="The Button" />);
 * ```
 *
 * Becomes:
 *
 * ```
 * input { Button } from './Button';
 * export default {
 *   title: 'Button'
 * }
 * export const story = () => <Button label="The Button" />;
 *
 * NOTES: only support chained storiesOf() calls
 */
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const defaultExports = root.find(j.ExportDefaultDeclaration);
  if (defaultExports.size() > 0) {
    return root.toSource();
  }

  function convertToModuleExports(path) {
    const base = j(path);

    let counter = 1;
    const statements = [];
    const extraExports = [];

    // .addDecorator
    const decorators = [];
    base
      .find(j.CallExpression)
      .filter(
        call => call.node.callee.property && call.node.callee.property.name === 'addDecorator'
      )
      .forEach(add => {
        const decorator = add.node.arguments[0];
        decorators.push(decorator);
      });
    if (decorators.length > 0) {
      decorators.reverse();
      extraExports.push(
        j.property('init', j.identifier('decorators'), j.arrayExpression(decorators))
      );
    }

    // .addParameters
    const parameters = [];
    base
      .find(j.CallExpression)
      .filter(
        call => call.node.callee.property && call.node.callee.property.name === 'addParameters'
      )
      .forEach(add => {
        // jscodeshift gives us the find results in reverse, but these args come in
        // order, so we double reverse here. ugh.
        const params = [...add.node.arguments[0].properties];
        params.reverse();
        params.forEach(prop => parameters.push(prop));
      });
    if (parameters.length > 0) {
      parameters.reverse();
      extraExports.push(
        j.property('init', j.identifier('parameters'), j.objectExpression(parameters))
      );
    }

    // storiesOf(...)
    base
      .find(j.CallExpression)
      .filter(call => call.node.callee.name === 'storiesOf')
      .filter(call => call.node.arguments.length > 0 && call.node.arguments[0].type === 'Literal')
      .forEach(storiesOf => {
        const title = storiesOf.node.arguments[0].value;
        statements.push(
          j.exportDefaultDeclaration(
            j.objectExpression([
              j.property('init', j.identifier('title'), j.literal(title)),
              ...extraExports,
            ])
          )
        );
      });

    // .add(...)
    const adds = [];
    base
      .find(j.CallExpression)
      .filter(add => add.node.callee.property && add.node.callee.property.name === 'add')
      .filter(add => add.node.arguments.length >= 2 && add.node.arguments[0].type === 'Literal')
      .forEach(add => adds.push(add));

    adds.reverse();
    adds.push(path);

    adds.forEach(add => {
      let name = add.node.arguments[0].value;
      let title = null;
      if (/\s/.exec(name)) {
        title = name;
        name = `story${counter}`;
      }
      const val = add.node.arguments[1];
      statements.push(
        j.exportDeclaration(
          false,
          j.variableDeclaration('const', [j.variableDeclarator(j.identifier(name), val)])
        )
      );
      if (title) {
        statements.push(
          j.assignmentStatement(
            '=',
            j.memberExpression(j.identifier(name), j.identifier('title')),
            j.literal(title)
          )
        );
      }
      if (add.node.arguments.length > 2) {
        const storyParams = add.node.arguments[2];
        statements.push(
          j.assignmentStatement(
            '=',
            j.memberExpression(j.identifier(name), j.identifier('parameters')),
            storyParams
          )
        );
      }
      counter += 1;
    });

    statements.reverse();
    statements.forEach(s => path.parent.insertAfter(s));
    base.remove();
  }

  // each top-level add expression corresponds to the last "add" of the chain.
  // replace it with the entire export statements
  const topLevelAddExpressions = root
    .find(j.CallExpression)
    .filter(add => add.node.callee.property && add.node.callee.property.name === 'add')
    .filter(add => add.node.arguments.length >= 2 && add.node.arguments[0].type === 'Literal')
    .filter(add => add.parentPath.node.type === 'ExpressionStatement')
    .forEach(convertToModuleExports);

  return root.toSource({ quote: 'single', trailingComma: 'true', tabWidth: 2 });
}
