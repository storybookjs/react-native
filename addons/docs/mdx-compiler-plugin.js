const mdxToJsx = require('@mdx-js/mdx/mdx-hast-to-jsx');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const camelCase = require('lodash/camelCase');
const jsStringEscape = require('js-string-escape');

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

function getStoryFn(name, counter) {
  if (name) {
    const storyFn = camelCase(name.replace(/[^a-z0-9-]/g, '-'));
    if (storyFn.length > 1 && !RESERVED.exec(storyFn)) {
      return storyFn;
    }
  }
  return `story${counter}`;
}

function genStoryExport(ast, counter) {
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
  const storyKey = getStoryFn(storyName, counter);

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

  if (storyName !== storyKey) {
    statements.push(`${storyKey}.story.name = '${storyName}';`);
  }

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

  return {
    [storyKey]: statements.join('\n'),
  };
}

function genPreviewExports(ast, counter) {
  // console.log('genPreviewExports', JSON.stringify(ast, null, 2));

  let localCounter = counter;
  const previewExports = {};
  for (let i = 0; i < ast.children.length; i += 1) {
    const child = ast.children[i];
    if (child.type === 'JSXElement' && child.openingElement.name.name === 'Story') {
      const storyExport = genStoryExport(child, localCounter);
      if (storyExport) {
        Object.assign(previewExports, storyExport);
        localCounter += 1;
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
const mdxKind = componentMeta.title || componentMeta.displayName;
const WrappedMDXContent = ({ context }) => <DocsContainer context={{...context, mdxKind}} content={MDXContent} />;
componentMeta.parameters = componentMeta.parameters || {};
componentMeta.parameters.docs = WrappedMDXContent;
`.trim();

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
  let counter = 0;
  node.children.forEach(n => {
    const exports = getExports(n, counter);
    if (exports) {
      const { stories, meta } = exports;
      if (stories) {
        Object.entries(stories).forEach(([key, story]) => {
          includeStories.push(key);
          storyExports.push(story);
          counter += 1;
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
  if (!metaExport) {
    metaExport = {};
  }
  metaExport.includeStories = JSON.stringify(includeStories);

  const fullJsx = [
    'import { DocsContainer } from "@storybook/addon-docs/blocks";',
    defaultJsx,
    ...storyExports,
    `const componentMeta = ${stringifyMeta(metaExport)};`,
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
