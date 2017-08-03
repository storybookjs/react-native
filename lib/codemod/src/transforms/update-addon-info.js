export default function transformer (file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const getOptions = args => {
    if (args[3] === undefined) {
      return [args[1]];
    } else {
      return [
        j.objectExpression([
          j.property('init', j.identifier('text'), args[1]),
          ...args[3].properties
        ])
      ];
    }
  };

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

  const checkWithInfoImport = root => {
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
    checkWithInfoImport(root);
    addWithInfoExpressions.replaceWith(withInfo);
  }

  return root.toSource();
}
