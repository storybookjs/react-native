import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { generate } from '@storybook/react-native/scripts/generate';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let pathMock: string | undefined;
let fileContentMock: string | undefined;

(globalThis as any).window = { navigator: {} };

const mockFs = {
  writeFileSync: (filePath: string, fileContent: string, opts: any) => {
    pathMock = filePath;
    fileContentMock = fileContent;
  },
};

describe('loader', () => {
  beforeEach(() => {
    pathMock = undefined;
    fileContentMock = undefined;
  });

  describe('writeRequires', () => {
    describe('when there is a story glob', () => {
      it('writes the story imports', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/all-config-files' });
        mock.reset();

        assert.strictEqual(
          pathMock,
          path.resolve(__dirname, 'mocks/all-config-files/storybook.requires.ts')
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when the main config is a cjs file', () => {
      it('writes the story imports', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/cjs-config' });
        mock.reset();

        assert.strictEqual(
          pathMock,
          path.resolve(__dirname, 'mocks/cjs-config/storybook.requires.ts')
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when using js', () => {
      it('writes the story imports without types', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/all-config-files', useJs: true });
        mock.reset();

        assert.strictEqual(
          pathMock,
          path.resolve(__dirname, 'mocks/all-config-files/storybook.requires.js')
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when there are different file extensions', () => {
      it('writes the story imports', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/file-extensions' });
        mock.reset();

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
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await assert.rejects(
          async () => await generate({ configPath: 'scripts/mocks/blank-config' }),
          Error
        );
        mock.reset();
      });
    });

    describe('when there is no preview', () => {
      it('does not add preview related stuff', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/no-preview' });
        mock.reset();

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
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/configuration-objects' });
        mock.reset();

        assert.strictEqual(
          pathMock,
          path.resolve(__dirname, 'mocks/configuration-objects/storybook.requires.ts')
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when host and port are provided', () => {
      it('includes STORYBOOK_WEBSOCKET with host and port', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({
          configPath: 'scripts/mocks/all-config-files',
          host: '192.168.1.100',
          port: 8080,
        });
        mock.reset();

        assert.ok(
          fileContentMock.includes(
            `globalThis.STORYBOOK_WEBSOCKET = {
  host: '192.168.1.100',
  port: 8080,
  secured: false,
};`
          )
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when only host is provided', () => {
      it('includes STORYBOOK_WEBSOCKET with host and default port', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({
          configPath: 'scripts/mocks/all-config-files',
          host: 'localhost',
        });
        mock.reset();

        assert.ok(
          fileContentMock.includes(
            `globalThis.STORYBOOK_WEBSOCKET = {
  host: 'localhost',
  port: 7007,
  secured: false,
};`
          )
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when host is not provided', () => {
      it('does not include STORYBOOK_WEBSOCKET assignment', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/all-config-files' });
        mock.reset();

        assert.ok(!fileContentMock.includes('globalThis.STORYBOOK_WEBSOCKET ='));
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when only port is provided without host', () => {
      it('includes STORYBOOK_WEBSOCKET with port and secured flag', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({
          configPath: 'scripts/mocks/all-config-files',
          port: 8080,
        });
        mock.reset();

        assert.ok(
          fileContentMock.includes(
            `globalThis.STORYBOOK_WEBSOCKET = {
  port: 8080,
  secured: false,
};`
          )
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when host and port are provided with useJs', () => {
      it('includes STORYBOOK_WEBSOCKET in JS file', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({
          configPath: 'scripts/mocks/all-config-files',
          useJs: true,
          host: '192.168.1.100',
          port: 8080,
        });
        mock.reset();

        assert.ok(
          fileContentMock.includes(
            `globalThis.STORYBOOK_WEBSOCKET = {
  host: '192.168.1.100',
  port: 8080,
  secured: false,
};`
          )
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when features are provided', () => {
      it('sets feature flags on globalThis.FEATURES', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/with-features' });
        mock.reset();

        assert.ok(fileContentMock.includes('globalThis.FEATURES.ondeviceBackgrounds = true;'));
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when no features are provided', () => {
      it('does not include FEATURES assignments', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/all-config-files' });
        mock.reset();

        assert.ok(!fileContentMock.includes('globalThis.FEATURES.'));
        t.assert.snapshot(fileContentMock);
      });
    });
  });
});
