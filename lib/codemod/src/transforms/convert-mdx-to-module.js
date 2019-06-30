// import recast from 'recast';
import camelCase from 'lodash/camelCase';
import mdx from '@mdx-js/mdx';
import prettier from 'prettier';

/**
 * Convert a compponent's MDX file into module story format
 */
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const code = mdx.sync(file.source, {});
  const root = j(code);

  function parseJsxAttributes(attributes) {
    const result = {};
    attributes.forEach(attr => {
      const key = attr.name.name;
      const val = attr.value.type === 'JSXExpressionContainer' ? attr.value.expression : attr.value;
      result[key] = val;
    });
    return result;
  }

  function genObjectExpression(attrs) {
    return j.objectExpression(
      Object.entries(attrs).map(([key, val]) => j.property('init', j.identifier(key), val))
    );
  }

  function convertToStories(path) {
    const base = j(path);

    const meta = {};
    const includeStories = [];
    const storyStatements = [];

    // get rid of all mdxType junk
    base
      .find(j.JSXAttribute)
      .filter(attr => attr.node.name.name === 'mdxType')
      .remove();

    // parse <Meta title="..." />
    base
      .find(j.JSXElement)
      .filter(elt => elt.node.openingElement.name.name === 'Meta')
      .forEach(elt => {
        const attrs = parseJsxAttributes(elt.node.openingElement.attributes);
        Object.assign(meta, attrs);
      });

    // parse <Story name="..." />
    base
      .find(j.JSXElement)
      .filter(elt => elt.node.openingElement.name.name === 'Story')
      .forEach(elt => {
        const attrs = parseJsxAttributes(elt.node.openingElement.attributes);
        const storyKey = camelCase(attrs.name.value);
        includeStories.push(storyKey);
        if (storyKey === attrs.name.value) {
          delete attrs.name;
        }
        storyStatements.push(
          j.exportDeclaration(
            false,
            j.variableDeclaration('const', [
              j.variableDeclarator(
                j.identifier(storyKey),
                j.arrowFunctionExpression([], elt.node.children[0])
              ),
            ])
          )
        );
        if (Object.keys(attrs).length > 0) {
          storyStatements.push(
            j.assignmentStatement(
              '=',
              j.memberExpression(j.identifier(storyKey), j.identifier('story')),
              genObjectExpression(attrs)
            )
          );
        }
        storyStatements.push(j.emptyStatement());
      });

    if (root.find(j.ExportNamedDeclaration).size() > 0) {
      meta.includeStories = j.arrayExpression(includeStories.map(key => j.literal(key)));
    }
    const statements = [
      j.exportDefaultDeclaration(genObjectExpression(meta)),
      j.emptyStatement(),
      ...storyStatements,
    ];

    const lastStatement = root.find(j.Statement).at(-1);
    statements.reverse().forEach(stmt => {
      lastStatement.insertAfter(stmt);
    });
    base.remove();
  }

  root.find(j.ExportDefaultDeclaration).forEach(convertToStories);

  // strip out Story/Meta import and MDX junk
  //   /* @jsx mdx */
  //   const makeShortcode = ...
  //   const layoutProps = {};
  //   const MDXLayout = 'wrapper';
  //   MDXContent.isMDXComponent = true;
  root
    .find(j.ImportDeclaration)
    .at(0)
    .replaceWith(exp => j.importDeclaration(exp.node.specifiers, exp.node.source));

  root
    .find(j.ImportDeclaration)
    .filter(exp => exp.node.source.value === '@storybook/addon-docs/blocks')
    .remove();

  const MDX_DECLS = ['makeShortcode', 'layoutProps', 'MDXLayout'];
  root
    .find(j.VariableDeclaration)
    .filter(
      decl =>
        decl.node.declarations.length === 1 && MDX_DECLS.includes(decl.node.declarations[0].id.name)
    )
    .remove();

  root
    .find(j.AssignmentExpression)
    .filter(
      expr =>
        expr.node.left.type === 'MemberExpression' && expr.node.left.object.name === 'MDXContent'
    )
    .remove();

  const source = root.toSource({ trailingComma: true, quote: 'single', tabWidth: 2 });
  return prettier.format(source, {
    parser: 'babel',
    printWidth: 100,
    tabWidth: 2,
    bracketSpacing: true,
    trailingComma: 'es5',
    singleQuote: true,
  });
}
