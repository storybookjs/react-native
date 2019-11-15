import 'jest-specific-snapshot';
import path from 'path';
import fs from 'fs-extra';
import mdx from '@mdx-js/mdx';
import prettier from 'prettier';
import plugin from './mdx-compiler-plugin';

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

const inputRegExp = /\.mdx$/;

describe('docs-mdx-compiler-plugin', () => {
  const transformFixturesDir = path.join(__dirname, '__testfixtures__');
  fs.readdirSync(transformFixturesDir)
    .filter(fileName => inputRegExp.test(fileName))
    .filter(fileName => fileName !== 'story-missing-props.mdx')
    .forEach(fixtureFile => {
      it(fixtureFile, async () => {
        const inputPath = path.join(transformFixturesDir, fixtureFile);
        const code = await generate(inputPath);
        expect(code).toMatchSpecificSnapshot(inputPath.replace(inputRegExp, '.output.snapshot'));
      });
    });
  it('errors on missing story props', async () => {
    await expect(
      generate(path.resolve(__dirname, './__testfixtures__/story-missing-props.mdx'))
    ).rejects.toThrow('Expected a story name or ID attribute');
  });
});
