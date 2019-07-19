import recast from 'recast';

// FIXME: duplicate code from @storybook/core start.js
function isExportStory(key, { includeStories, excludeStories }) {
  function matches(storyKey, arrayOrRegex) {
    if (Array.isArray(arrayOrRegex)) {
      return arrayOrRegex.includes(storyKey);
    }
    return storyKey.match(arrayOrRegex);
  }
  return (
    (!includeStories || matches(key, includeStories)) &&
    (!excludeStories || !matches(key, excludeStories))
  );
}

function exportMdx(root, options) {
  // eslint-disable-next-line no-underscore-dangle
  const path = root.__paths[0];

  // FIXME: insert the title as markdown after all of the imports
  return path.node.program.body
    .map(n => {
      const { code } = recast.prettyPrint(n, options);
      if (n.type === 'JSXElement') {
        return `${code}\n`;
      }
      return code;
    })
    .join('\n');
}

function parseIncludeExclude(prop) {
  const { code } = recast.prettyPrint(prop, {});
  // eslint-disable-next-line no-eval
  return eval(code);
}

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

  // FIXME: save out all the storyFn.story = { ... }
  const storyKeyToStory = {};
  // save out includeStories / excludeStories
  const meta = {};

  function makeAttr(key, val) {
    return j.jsxAttribute(
      j.jsxIdentifier(key),
      val.type === 'Literal' ? val : j.jsxExpressionContainer(val)
    );
  }

  function getStoryContents(node) {
    return node.type === 'ArrowFunctionExpression' && node.body.type === 'JSXElement'
      ? node.body
      : j.jsxExpressionContainer(node);
  }

  function getName(storyKey) {
    const story = storyKeyToStory[storyKey];
    if (story) {
      const name = story.properties.find(prop => prop.key.name === 'name');
      if (name && name.value.type === 'Literal') {
        return name.value.value;
      }
    }
    return storyKey;
  }

  function getStoryAttrs(storyKey) {
    const attrs = [];
    const story = storyKeyToStory[storyKey];
    if (story) {
      story.properties.forEach(prop => {
        const { key, value } = prop;
        if (key.name !== 'name') {
          attrs.push(makeAttr(key.name, value));
        }
      });
    }
    return attrs;
  }

  // 1. If the program does not have `export default { title: '....' }, skip it
  const defaultExportWithTitle = root
    .find(j.ExportDefaultDeclaration)
    .filter(def => def.node.declaration.properties.map(p => p.key.name).includes('title'));
  if (defaultExportWithTitle.size() === 0) {
    return root.toSource();
  }

  // 2a. Add imports from '@storybook/addon-docs/blocks'
  root
    .find(j.ImportDeclaration)
    .at(-1)
    .insertAfter(j.emptyStatement())
    .insertAfter(
      j.importDeclaration(
        [j.importSpecifier(j.identifier('Meta')), j.importSpecifier(j.identifier('Story'))],
        j.literal('@storybook/addon-docs/blocks')
      )
    );
  // 2b. Remove react import which is implicit
  root
    .find(j.ImportDeclaration)
    .filter(decl => decl.node.source.value === 'react')
    .remove();

  // 3. Save out all the excluded stories
  defaultExportWithTitle.forEach(exp => {
    exp.node.declaration.properties.forEach(p => {
      if (['includeStories', 'excludeStories'].includes(p.key.name)) {
        meta[p.key.name] = parseIncludeExclude(p.value);
      }
    });
  });

  // 4. Collect all the story exports in storyKeyToStory[key] = null;
  const namedExports = root.find(j.ExportNamedDeclaration);
  namedExports.forEach(exp => {
    const storyKey = exp.node.declaration.declarations[0].id.name;
    if (isExportStory(storyKey, meta)) {
      storyKeyToStory[storyKey] = null;
    }
  });

  // 5. Collect all the storyKey.story in storyKeyToStory and also remove them
  const storyAssignments = root.find(j.AssignmentExpression).filter(exp => {
    const { left } = exp.node;
    return (
      left.type === 'MemberExpression' &&
      (left.object.type === 'Identifier' && left.object.name in storyKeyToStory) &&
      (left.property.type === 'Identifier' && left.property.name === 'story')
    );
  });
  storyAssignments.forEach(exp => {
    const { left, right } = exp.node;
    storyKeyToStory[left.object.name] = right;
  });
  storyAssignments.remove();

  // 6. Convert the default export to <Meta />
  defaultExportWithTitle.replaceWith(exp => {
    const jsxId = j.jsxIdentifier('Meta');
    const attrs = [];
    exp.node.declaration.properties.forEach(prop => {
      const { key, value } = prop;
      if (!['includeStories', 'excludeStories'].includes(key.name)) {
        attrs.push(makeAttr(key.name, value));
      }
    });
    const opening = j.jsxOpeningElement(jsxId, attrs);
    opening.selfClosing = true;
    return j.jsxElement(opening);
  });

  // 7. Convert all the named exports to <Story>...</Story>
  namedExports.replaceWith(exp => {
    const storyKey = exp.node.declaration.declarations[0].id.name;
    if (!isExportStory(storyKey, meta)) {
      return exp.node;
    }
    const jsxId = j.jsxIdentifier('Story');
    const name = getName(storyKey);
    const attributes = [makeAttr('name', j.literal(name)), ...getStoryAttrs(storyKey)];
    const opening = j.jsxOpeningElement(jsxId, attributes);
    const closing = j.jsxClosingElement(jsxId);
    const children = [getStoryContents(exp.node.declaration.declarations[0].init)];
    return j.jsxElement(opening, closing, children);
  });

  return exportMdx(root, { quote: 'single', trailingComma: 'true', tabWidth: 2 });
}
