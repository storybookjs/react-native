import { stat } from 'fs';

/**
 * Convert a compponent's module story file into an MDX file
 *
 * For example:
 *
 * ```
 * input { Button } from './Button';
 * export default {
 *   title: 'Button'
 * }
 * export const story = () => <Button label="The Button" />;
 * ```
 *
 * Becomes:
 *
 * ```
 * import { Meta, Story } from '@storybook/addon-docs/blocks';
 * input { Button } from './Button';
 *
 * <Meta title='Button' />
 *
 * <Story name='story'>
 *   <Button label="The Button" />
 * </Story>
 * ```
 */
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  function convertToMeta(path) {
    // console.log('path', path);
    const jsxId = j.jsxIdentifier('Meta');
    const attributes = []; // j.jsxAttribute(j.jsxIdentifier('title'), j.literal('foo'))];
    const opening = j.jsxOpeningElement(jsxId, attributes);
    opening.selfClosing = true;
    return j.jsxExpressionContainer(j.jsxElement(opening));
    // return j.jsxElement(opening, j.jsxClosingElement(jsxId), [
    //   j.jsxText(''),
    // ]);
  }

  root
    .find(j.ExportDefaultDeclaration)
    // .filter(add => add.node.callee.property && add.node.callee.property.name === 'add')
    // .filter(add => add.node.arguments.length >= 2 && add.node.arguments[0].type === 'Literal')
    // .filter(add => add.parentPath.node.type === 'ExpressionStatement')
    .replaceWith(convertToMeta);

  // function convertToStory(path) {
  //   console.log('path', path);
  //   const jsxId = j.jsxIdentifier('Story');
  //   const attributes = [j.jsxAttribute(j.jsxIdentifier('title'), j.literal('foo'))];
  //   return j.jsxElement(j.jsxOpeningElement(jsxId, attributes), j.jsxClosingElement(jsxId), []);
  // }

  // root
  //   .find(j.ExportDeclaration)
  //   // .filter(add => add.node.callee.property && add.node.callee.property.name === 'add')
  //   // .filter(add => add.node.arguments.length >= 2 && add.node.arguments[0].type === 'Literal')
  //   // .filter(add => add.parentPath.node.type === 'ExpressionStatement')
  //   .replaceWith(convertToStory);

  return root.toSource({ quote: 'single', trailingComma: 'true', tabWidth: 2 });
}
