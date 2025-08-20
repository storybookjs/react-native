const { describe, it, beforeEach, mock } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { generate } = require('./generate');

let pathMock;
let fileContentMock;

global.window = { navigator: {} };

const mockFs = {
  writeFileSync: (filePath, fileContent, opts) => {
    pathMock = filePath;
    fileContentMock = fileContent;
  },
};

mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);

describe('loader', () => {
  beforeEach(() => {
    pathMock = undefined;
    fileContentMock = undefined;
  });

  describe('writeRequires', () => {
    describe('when there is a story glob', () => {
      it('writes the story imports', async (t) => {
        await generate({ configPath: 'scripts/mocks/all-config-files' });
        assert.strictEqual(
          pathMock,
          path.resolve(__dirname, 'mocks/all-config-files/storybook.requires.ts')
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when using js', () => {
      it('writes the story imports without types', async (t) => {
        await generate({ configPath: 'scripts/mocks/all-config-files', useJs: true });
        assert.strictEqual(
          pathMock,
          path.resolve(__dirname, 'mocks/all-config-files/storybook.requires.js')
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when there are different file extensions', () => {
      it('writes the story imports', async (t) => {
        await generate({ configPath: 'scripts/mocks/file-extensions' });
        assert.strictEqual(
          pathMock,
          path.resolve(__dirname, 'mocks/file-extensions/storybook.requires.ts')
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    // TODO can we support exclude globs?
    // describe('when there is a story glob and exclude paths globs', () => {
    //   it('writes the story imports', () => {
    //     generate({ configPath: 'scripts/mocks/exclude-config-files' });
    //     assert.strictEqual(
    //       pathMock,
    //       path.resolve(__dirname, 'mocks/exclude-config-files/storybook.requires.ts')
    //     );

    //     assert.ok(fileContentMock.includes('include-components/FakeStory.stories.tsx'));
    //     assert.ok(!fileContentMock.includes('exclude-components/FakeStory.stories.tsx'));

    //     t.assert.snapshot(fileContentMock);
    //   });
    // });

    describe('when there is no story glob or addons', () => {
      it('throws an error', async () => {
        await assert.rejects(
          async () => await generate({ configPath: 'scripts/mocks/blank-config' }),
          Error
        );
      });
    });

    describe('when there is no preview', () => {
      it('does not add preview related stuff', async (t) => {
        await generate({ configPath: 'scripts/mocks/no-preview' });
        assert.strictEqual(
          pathMock,
          path.resolve(__dirname, 'mocks/no-preview/storybook.requires.ts')
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    // TODO does this still make sense?
    // describe('when the absolute option is true', () => {
    //   it('should write absolute paths to the requires file', () => {
    //     generate({ configPath: 'scripts/mocks/all-config-files', absolute: true });
    //     assert.strictEqual(
    //       pathMock,
    //       path.resolve(__dirname, 'mocks/all-config-files/storybook.requires.ts')
    //     );

    //     // assert.ok(fileContentMock.includes(`FakeStory.stories.tsx`));
    //     assert.ok(fileContentMock.includes(path.resolve(__dirname, 'mocks/all-config-files')));
    //   });
    // });

    describe('when there is a configuration object', () => {
      it('writes the story imports', async (t) => {
        await generate({ configPath: 'scripts/mocks/configuration-objects' });
        assert.strictEqual(
          pathMock,
          path.resolve(__dirname, 'mocks/configuration-objects/storybook.requires.ts')
        );
        t.assert.snapshot(fileContentMock);
      });
    });
  });
});
