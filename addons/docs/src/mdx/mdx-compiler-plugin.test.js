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
  it('supports vanilla mdx', async () => {
    const code = await generate(path.resolve(__dirname, './fixtures/vanilla.mdx'));
    expect(code).toMatchSnapshot();
  });
  it('supports story definitions', async () => {
    const code = await generate(path.resolve(__dirname, './fixtures/story-definitions.mdx'));
    expect(code).toMatchSnapshot();
  });
  it('supports text-only story definitions', async () => {
    const code = await generate(path.resolve(__dirname, './fixtures/story-def-text-only.mdx'));
    expect(code).toMatchSnapshot();
  });
  it('supports object-style story definitions', async () => {
    const code = await generate(path.resolve(__dirname, './fixtures/story-object.mdx'));
    expect(code).toMatchSnapshot();
  });
  it('supports story references', async () => {
    const code = await generate(path.resolve(__dirname, './fixtures/story-references.mdx'));
    expect(code).toMatchSnapshot();
  });
  it('supports "smart" current story', async () => {
    const code = await generate(path.resolve(__dirname, './fixtures/story-current.mdx'));
    expect(code).toMatchSnapshot();
  });
  it('supports previews', async () => {
    const code = await generate(path.resolve(__dirname, './fixtures/previews.mdx'));
    expect(code).toMatchSnapshot();
  });
  it('supports decorators', async () => {
    const code = await generate(path.resolve(__dirname, './fixtures/decorators.mdx'));
    expect(code).toMatchSnapshot();
  });
  it('supports parameters', async () => {
    const code = await generate(path.resolve(__dirname, './fixtures/parameters.mdx'));
    expect(code).toMatchSnapshot();
  });
  it('supports non-story exports', async () => {
    const code = await generate(path.resolve(__dirname, './fixtures/non-story-exports.mdx'));
    expect(code).toMatchSnapshot();
  });
  it('supports function stories', async () => {
    const code = await generate(path.resolve(__dirname, './fixtures/story-function.mdx'));
    expect(code).toMatchSnapshot();
  });
  it('errors on missing story props', async () => {
    await expect(
      generate(path.resolve(__dirname, './fixtures/story-missing-props.mdx'))
    ).rejects.toThrow('Expected a story name or ID attribute');
  });
});
