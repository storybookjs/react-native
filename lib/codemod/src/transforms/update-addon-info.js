/**
 * Takes the deprecated addon-info API, addWithInfo, and
 * converts to the new withInfo API.
 *
 * Example of deprecated addWithInfo API:
 *
 * storiesOf('Button')
 *   .addWithInfo(
 *     'story name',
 *     'Story description.',
 *     () => (
 *       <Button label="The Button" />
 *     )
 *   )
 *
 * Converts to the new withInfo API:
 *
 * storiesOf('Button')
 *   .add('story name', withInfo(
 *     'Story description.'
 *   )(() => (
 *     <Button label="The Button" />
 *   )))
 */
export default function transformer (file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  /**
   * Returns a list of parameters for the withInfo function. The contents
   * of this list is either the second argument from the original
   * addWithInfo function, if no additional options were used, or a
   * combined object of all the options from the original function.
   * @param {list} args - original addWithInfo function parameters
   * @return {list} the modified list of parameters for the new function
   */
  const getOptions = args => {
    if (args[3] === undefined) {
      return [args[1]];
    }
    return [
      j.objectExpression([
        j.property('init', j.identifier('text'), args[1]),
        ...args[3].properties
      ])
    ];
  };

  /**
   * Constructs the new withInfo function from the parameters of the
   * original addWithInfo function.
   * @param {CallExpression} addWithInfoExpression - original function
   * @returns {CallExpression} the new withInfo function
   */
  const withInfo = addWithInfoExpression => {
    const node = addWithInfoExpression.node;
    const args = node.arguments;

    node.callee.property.name = 'add';
    node.arguments = [
      args[0],
      j.callExpression(
        j.callExpression(
          j.identifier('withInfo'),
          getOptions(args)
        ),
        [args[2]]
      )
    ];

    return node;
  };

  /**
   * Checks for - import { withInfo } from "@storybook/addon-info";
   * Adds the import if necessary.
   */
  const checkWithInfoImport = () => {
    const importExists = root.find(j.ImportDeclaration)
      .filter(imp => imp.node.source.value === '@storybook/addon-info')
      .size();

    if (importExists) return;

    root.find(j.ImportDeclaration)
      .at(-1)
      .insertAfter(
        j.importDeclaration(
          [j.importSpecifier(j.identifier('withInfo'))],
          j.literal('@storybook/addon-info')
        )
      );
  };

  const addWithInfoExpressions = root.find(
    j.CallExpression,
    {
      callee: {
        property: {
          name: 'addWithInfo'
        }
      }
    }
  );

  if (addWithInfoExpressions.size()) {
    checkWithInfoImport();
    addWithInfoExpressions.replaceWith(withInfo);
  }

  return root.toSource();
}
