interface PostinstallContext {
  root: any;
  api: any;
}

export function addPreset(preset: string, presetOptions: any, { api, root }: PostinstallContext) {
  const j = api.jscodeshift;
  const moduleExports: any[] = [];
  root
    .find(j.AssignmentExpression)
    .filter(
      (assignment: any) =>
        assignment.node.left.type === 'MemberExpression' &&
        assignment.node.left.object.name === 'module' &&
        assignment.node.left.property.name === 'exports'
    )
    .forEach((exp: any) => moduleExports.push(exp));

  let exportArray = null;
  switch (moduleExports.length) {
    case 0: {
      exportArray = j.arrayExpression([]);
      const exportStatement = j.assignmentStatement(
        '=',
        j.memberExpression(j.identifier('module'), j.identifier('exports')),
        exportArray
      );
      root.get().node.program.body.push(exportStatement);
      break;
    }
    case 1:
      exportArray = moduleExports[0].node.right;
      break;
    default:
      throw new Error('Multiple module export statements');
  }

  let presetConfig = j.literal(preset);
  if (presetOptions) {
    const optionsJson = `const x = ${JSON.stringify(presetOptions)}`;
    const optionsRoot = j(optionsJson);
    const optionsNode = optionsRoot.find(j.VariableDeclarator).get().node.init;

    presetConfig = j.objectExpression([
      j.property('init', j.identifier('name'), j.literal(preset)),
      j.property('init', j.identifier('options'), optionsNode),
    ]);
  }
  exportArray.elements.push(presetConfig);
}
