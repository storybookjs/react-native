const path = require('path');
const fs = require('fs-extra');
const mdx = require('@mdx-js/mdx');
const prettier = require('prettier');
const plugin = require('./mdx-compiler-plugin');

async function generate(filePath) {
  const content = await fs.readFile(filePath, 'utf8');

  const code = mdx.sync(content, {
    filepath: filePath,
    compilers: [plugin({})],
  });

  return prettier.format(code, {
    parser: 'babel',
    printWidth: 100,
    tabWidth: 2,
    bracketSpacing: true,
    trailingComma: 'es5',
    singleQuote: true,
  });
}

describe('docs-mdx-compiler-plugin', () => {
  const fixtures = [
    'vanilla.mdx',
    'story-definitions.mdx',
    'story-def-text-only.mdx',
    'story-object.mdx',
    'story-references.mdx',
    'story-current.mdx',
    'previews.mdx',
    'decorators.mdx',
    'parameters.mdx',
    'non-story-exports.mdx',
    'story-function.mdx',
    'docs-only.mdx',
    'story-function-var.mdx',
  ];
  fixtures.forEach(fixtureFile => {
    it(fixtureFile, async () => {
      const code = await generate(path.resolve(__dirname, `./__testfixtures__/${fixtureFile}`));
      expect(code).toMatchSnapshot();
    });
  });
  it('errors on missing story props', async () => {
    await expect(
      generate(path.resolve(__dirname, './__testfixtures__/story-missing-props.mdx'))
    ).rejects.toThrow('Expected a story name or ID attribute');
  });
});
