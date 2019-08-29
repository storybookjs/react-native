const mdxToJsx = require('@mdx-js/mdx/mdx-hast-to-jsx');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const camelCase = require('lodash/camelCase');
const jsStringEscape = require('js-string-escape');
const { toId, storyNameFromExport } = require('@storybook/router/utils');

// Generate the MDX as is, but append named exports for every
// story in the contents

const STORY_REGEX = /^<Story[\s>]/;
const PREVIEW_REGEX = /^<Preview[\s>]/;
const META_REGEX = /^<Meta[\s>]/;
const RESERVED = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|await|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;

function getAttr(elt, what) {
  const attr = elt.attributes.find(n => n.name.name === what);
  return attr && attr.value;
}

const isReserved = name => RESERVED.exec(name);

const sanitizeName = name => {
  let key = camelCase(name);
  if (isReserved(key)) {
    key = `${key}Story`;
  }
  return key;
};

const getStoryKey = (name, counter) => (name ? sanitizeName(name) : `story${counter}`);

function genStoryExport(ast, context) {
  let storyName = getAttr(ast.openingElement, 'name');
  let storyId = getAttr(ast.openingElement, 'id');
  storyName = storyName && storyName.value;
  storyId = storyId && storyId.value;

  if (!storyId && !storyName) {
    throw new Error('Expected a story name or ID attribute');
  }

  // We don't generate exports for story references or the smart "current story"
  if (storyId || !storyName) {
    return null;
  }

  // console.log('genStoryExport', JSON.stringify(ast, null, 2));

  const statements = [];
  const storyKey = getStoryKey(storyName, context.counter);

  let body = ast.children.find(n => n.type !== 'JSXText');
  let storyCode = null;
  if (!body) {
    // plain text node
    const { code } = generate(ast.children[0], {});
    storyCode = `'${code}'`;
  } else {
    if (body.type === 'JSXExpressionContainer') {
      // FIXME: handle fragments
      body = body.expression;
    }
    const { code } = generate(body, {});
    storyCode = code;
  }
  if (storyCode.trim().startsWith('() =>')) {
    statements.push(`export const ${storyKey} = ${storyCode}`);
  } else {
    statements.push(
      `export const ${storyKey} = () => (
        ${storyCode}
      );`
    );
  }
  statements.push(`${storyKey}.story = {};`);

  // always preserve the name, since CSF exports can get modified by displayName
  statements.push(`${storyKey}.story.name = '${storyName}';`);

  let parameters = getAttr(ast.openingElement, 'parameters');
  parameters = parameters && parameters.expression;
  const source = jsStringEscape(storyCode);
  if (parameters) {
    const { code: params } = generate(parameters, {});
    // FIXME: hack in the story's source as a parameter
    statements.push(`${storyKey}.story.parameters = { mdxSource: '${source}', ...${params} };`);
  } else {
    statements.push(`${storyKey}.story.parameters = { mdxSource: '${source}' };`);
  }

  let decorators = getAttr(ast.openingElement, 'decorators');
  decorators = decorators && decorators.expression;
  if (decorators) {
    const { code: decos } = generate(decorators, {});
    statements.push(`${storyKey}.story.decorators = ${decos};`);
  }

  // eslint-disable-next-line no-param-reassign
  context.storyNameToKey[storyName] = storyKey;

  return {
    [storyKey]: statements.join('\n'),
  };
}

function genPreviewExports(ast, context) {
  // console.log('genPreviewExports', JSON.stringify(ast, null, 2));

  const previewExports = {};
  for (let i = 0; i < ast.children.length; i += 1) {
    const child = ast.children[i];
    if (child.type === 'JSXElement' && child.openingElement.name.name === 'Story') {
      const storyExport = genStoryExport(child, context);
      if (storyExport) {
        Object.assign(previewExports, storyExport);
        // eslint-disable-next-line no-param-reassign
        context.counter += 1;
      }
    }
  }
  return previewExports;
}

function genMeta(ast) {
  let title = getAttr(ast.openingElement, 'title');
  let parameters = getAttr(ast.openingElement, 'parameters');
  let decorators = getAttr(ast.openingElement, 'decorators');
  title = title && `'${title.value}'`;
  if (parameters && parameters.expression) {
    const { code: params } = generate(parameters.expression, {});
    parameters = params;
  }
  if (decorators && decorators.expression) {
    const { code: decos } = generate(decorators.expression, {});
    decorators = decos;
  }
  return {
    title,
    parameters,
    decorators,
  };
}

function getExports(node, counter) {
  const { value, type } = node;
  if (type === 'jsx') {
    if (STORY_REGEX.exec(value)) {
      // Single story
      const ast = parser.parseExpression(value, { plugins: ['jsx'] });
      const storyExport = genStoryExport(ast, counter);
      return storyExport && { stories: storyExport };
    }
    if (PREVIEW_REGEX.exec(value)) {
      // Preview, possibly containing multiple stories
      const ast = parser.parseExpression(value, { plugins: ['jsx'] });
      return { stories: genPreviewExports(ast, counter) };
    }
    if (META_REGEX.exec(value)) {
      // Preview, possibly containing multiple stories
      const ast = parser.parseExpression(value, { plugins: ['jsx'] });
      return { meta: genMeta(ast) };
    }
  }
  return null;
}

// insert `mdxKind` into the context so that we can know what "kind" we're rendering into
// when we render <Story name="xxx">...</Story>, since this MDX can be attached to any `selectedKind`!
const wrapperJs = `
componentMeta.parameters = componentMeta.parameters || {};
componentMeta.parameters.docs = {
  container: ({ context, children }) => <DocsContainer context={{...context, mdxStoryNameToId}}>{children}</DocsContainer>,
  page: MDXContent,
};
`.trim();

// Use this rather than JSON.stringify because `Meta`'s attributes
// are already valid code strings, so we want to insert them raw
// rather than add an extra set of quotes
function stringifyMeta(meta) {
  let result = '{ ';
  Object.entries(meta).forEach(([key, val]) => {
    if (val) {
      result += `${key}: ${val}, `;
    }
  });
  result += ' }';
  return result;
}

function extractExports(node, options) {
  // we're overriding default export
  const defaultJsx = mdxToJsx.toJSX(node, {}, { ...options, skipExport: true });
  const storyExports = [];
  const includeStories = [];
  let metaExport = null;
  const context = {
    counter: 0,
    storyNameToKey: {},
  };
  node.children.forEach(n => {
    const exports = getExports(n, context);
    if (exports) {
      const { stories, meta } = exports;
      if (stories) {
        Object.entries(stories).forEach(([key, story]) => {
          includeStories.push(key);
          storyExports.push(story);
        });
      }
      if (meta) {
        if (metaExport) {
          throw new Error('Meta can only be declared once');
        }
        metaExport = meta;
      }
    }
  });
  if (metaExport) {
    if (!storyExports.length) {
      storyExports.push('export const __page = () => { throw new Error("Docs-only story"); };');
      storyExports.push('__page.story = { parameters: { docsOnly: true } };');
      includeStories.push('__page');
    }
  } else {
    metaExport = {};
  }
  metaExport.includeStories = JSON.stringify(includeStories);

  const { title } = metaExport;
  const mdxStoryNameToId = Object.entries(context.storyNameToKey).reduce(
    (acc, [storyName, storyKey]) => {
      if (title) {
        acc[storyName] = toId(title, storyNameFromExport(storyKey));
      }
      return acc;
    },
    {}
  );

  const fullJsx = [
    'import { DocsContainer } from "@storybook/addon-docs/blocks";',
    defaultJsx,
    ...storyExports,
    `const componentMeta = ${stringifyMeta(metaExport)};`,
    `const mdxStoryNameToId = ${JSON.stringify(mdxStoryNameToId)};`,
    wrapperJs,
    'export default componentMeta;',
  ].join('\n\n');

  return fullJsx;
}

function createCompiler(mdxOptions) {
  return function compiler(options = {}) {
    this.Compiler = tree => extractExports(tree, options, mdxOptions);
  };
}

module.exports = createCompiler;
