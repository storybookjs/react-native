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

  const defaultExports = root
    .find(j.ExportSpecifier)
    .filter(path => path.node.local.name === 'default');

  if (defaultExports && defaultExports.length > 0) {
    return null; // keep original source
  }

  function convertToModuleDefault(call) {
    const title = call.node.arguments[0].value;
    const addParameters = j(call)
      .find(j.CallExpression)
      .filter(method => method.node.callee.name === 'addParameters');

    const kindParams =
      addParameters && addParameters.length
        ? j.property('parameters', addParameters.node.arguments[0].value)
        : null;

    const result = j.exportDefaultDeclaration(
      j.objectExpression([j.property('init', j.identifier('title'), j.literal(title))])
    );

    return result;
  }

  function convertToModuleExports(path) {
    const base = j(path);

    const statements = [];

    // storiesOf(...)
    base
      .find(j.CallExpression)
      .filter(call => call.node.callee.name === 'storiesOf')
      .filter(call => call.node.arguments.length > 0 && call.node.arguments[0].type === 'Literal')
      .forEach(storiesOf => {
        const title = storiesOf.node.arguments[0].value;
        statements.push(
          j.exportDefaultDeclaration(
            j.objectExpression([j.property('init', j.identifier('title'), j.literal(title))])
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

    adds.push(path);
    adds.forEach(add => {
      const name = add.node.arguments[0].value;
      const val = add.node.arguments[1];
      if (add.node.arguments.length > 2) {
        const storyParams = add.node.arguments[2].value;
      }
      statements.push(
        j.exportDeclaration(
          false,
          j.variableDeclaration('const', [j.variableDeclarator(j.identifier(name), val)])
        )
      );
    });

    return j.blockStatement(statements);
  }

  // each top-level add expression corresponds to the last "add" of the chain.
  // replace it with the entire export statements
  const topLevelAddExpressions = root
    .find(j.CallExpression)
    .filter(add => add.node.callee.property && add.node.callee.property.name === 'add')
    .filter(add => add.node.arguments.length >= 2 && add.node.arguments[0].type === 'Literal')
    .filter(add => add.parentPath.node.type === 'ExpressionStatement');

  topLevelAddExpressions.replaceWith(convertToModuleExports);

  return root.toSource();
}
