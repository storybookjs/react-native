import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import vm from 'node:vm';
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

/**
 * Pull the globalThis.FEATURES statements out of a generated requires file so they can be run on
 * their own, either before or after @storybook/react-native creates the object. Both the merged
 * object form and the older per-flag form are matched so this keeps reporting on a generator that
 * still writes the broken version instead of passing on nothing.
 */
const getFeaturesStatements = (content: string) =>
  [
    ...(content.match(/globalThis\.FEATURES\.[A-Za-z_$][\w$]* = [^;]+;/g) ?? []),
    ...(content.match(/globalThis\.FEATURES = \{[\s\S]*?\n\};/g) ?? []),
  ].join('\n');

const runFeaturesStatements = (
  statements: string,
  initialFeatures?: Record<string, unknown>
): Record<string, unknown> => {
  const sandbox: { FEATURES?: Record<string, unknown> } = {};
  const context = vm.createContext(sandbox);

  if (initialFeatures !== undefined) {
    vm.runInContext(`globalThis.FEATURES = ${JSON.stringify(initialFeatures)}`, context);
  }

  vm.runInContext(statements, context);
  // copy out of the vm realm so the result has this realm's Object.prototype
  return { ...sandbox.FEATURES };
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

        assert.ok(
          fileContentMock.includes(
            `globalThis.FEATURES = {
  ...globalThis.FEATURES,
  ondeviceBackgrounds: true,
};`
          )
        );
        t.assert.snapshot(fileContentMock);
      });

      it('does not read globalThis.FEATURES before it exists', async () => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/with-features' });
        mock.reset();

        // with inlineRequires the generated file runs before @storybook/react-native creates
        // globalThis.FEATURES, so the statements must not read from a missing object
        const features = runFeaturesStatements(getFeaturesStatements(fileContentMock));

        assert.deepStrictEqual(features, { ondeviceBackgrounds: true });
      });

      it('keeps feature flags that were already set', async () => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/with-features' });
        mock.reset();

        const features = runFeaturesStatements(getFeaturesStatements(fileContentMock), {
          measure: false,
          backgrounds: false,
        });

        assert.deepStrictEqual(features, {
          measure: false,
          backgrounds: false,
          ondeviceBackgrounds: true,
        });
      });

      it('quotes feature keys that are not valid identifiers', async () => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/with-non-identifier-feature-key' });
        mock.reset();

        assert.ok(
          fileContentMock.includes(
            `globalThis.FEATURES = {
  ...globalThis.FEATURES,
  "foo-bar": true,
  ondeviceBackgrounds: false,
};`
          )
        );

        const statements = getFeaturesStatements(fileContentMock);
        assert.ok(statements, 'no FEATURES statements were generated');

        assert.deepStrictEqual(runFeaturesStatements(statements), {
          'foo-bar': true,
          ondeviceBackgrounds: false,
        });
      });
    });

    describe('when no features are provided', () => {
      it('does not include FEATURES assignments', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/all-config-files' });
        mock.reset();

        assert.ok(!fileContentMock.includes('globalThis.FEATURES'));
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when storySorts are provided in main', () => {
      it('writes storySorts and passes them to start and updateView', async (t) => {
        const warn = mock.method(console, 'warn', mock.fn());
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/with-story-sorts' });
        mock.reset();

        assert.ok(fileContentMock.includes('const storySorts'));
        assert.ok(fileContentMock.includes('"order": ["Introduction", "Components"]'));
        assert.ok(fileContentMock.includes('localeCompare'));
        assert.ok(fileContentMock.includes('    storySorts,'));
        assert.ok(fileContentMock.includes(', options, storySorts);'));
        assert.strictEqual(warn.mock.callCount(), 0);
        t.assert.snapshot(fileContentMock);
      });

      it('writes storySorts without types in js', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/with-story-sorts', useJs: true });
        mock.reset();

        assert.ok(fileContentMock.includes('const storySorts = ['));
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('storySorts serialization', () => {
      // Evaluates the `storySorts` the requires file declares, as the device would.
      const evaluateStorySorts = (fileContent: string) => {
        const match = fileContent.match(
          /const storySorts = ([\s\S]*?);\n\nif \(!globalThis\.view\)/
        );
        assert.ok(match, 'storySorts declaration not found');
        return new Function(`return ${match[1]};`)();
      };

      const story = (title: string, name: string) => ({
        id: `${title}--${name}`.toLowerCase(),
        title,
        name,
      });

      it('round-trips objects, arrays and comparator functions', async () => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/story-sorts-variants', useJs: true });
        mock.reset();

        const { default: main } = await import('./mocks/story-sorts-variants/main.js');
        const storySorts = evaluateStorySorts(fileContentMock);

        assert.strictEqual(storySorts.length, main.storySorts.length);
        assert.deepStrictEqual(storySorts[0], main.storySorts[0]);
        assert.deepStrictEqual(storySorts[1], main.storySorts[1]);

        const pairs = [
          [story('Components/Button', 'Primary'), story('Intro', 'Welcome')],
          [story('Intro', 'Welcome'), story('Components/Button', 'Primary')],
          [story('Hooks', 'Basic'), story('Hooks', 'Advanced')],
        ];
        for (const index of [2, 3, 4]) {
          assert.strictEqual(typeof storySorts[index], 'function');
          for (const [a, b] of pairs) {
            assert.strictEqual(storySorts[index](a, b), main.storySorts[index](a, b));
          }
        }
      });

      it('types comparator parameters in the ts requires file', async () => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/story-sorts-variants' });
        mock.reset();

        const declaration = fileContentMock.match(/const storySorts: [\s\S]*?;\n\nif/)?.[0];
        assert.ok(declaration, 'typed storySorts declaration not found');

        const ts = require('typescript');
        const fileName = path.resolve(__dirname, 'mocks/story-sorts-variants/storySorts.check.ts');
        const source = `import { start } from '@storybook/react-native';\n${declaration.replace(/\n\nif$/, '')}\nexport { storySorts };\n`;
        const host = ts.createCompilerHost({});
        const readFile = host.readFile;
        host.readFile = (file: string) => (file === fileName ? source : readFile(file));
        host.fileExists = (
          (fileExists) => (file: string) =>
            file === fileName || fileExists(file)
        )(host.fileExists);
        const program = ts.createProgram(
          [fileName],
          {
            strict: true,
            noEmit: true,
            skipLibCheck: true,
            jsx: ts.JsxEmit.ReactNative,
            module: ts.ModuleKind.ESNext,
            moduleResolution: ts.ModuleResolutionKind.Bundler,
            target: ts.ScriptTarget.ESNext,
          },
          host
        );
        const diagnostics = ts
          .getPreEmitDiagnostics(program)
          .filter(
            (diagnostic: { file?: { fileName: string } }) => diagnostic.file?.fileName === fileName
          )
          .map((diagnostic: { messageText: unknown }) =>
            ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
          );

        assert.deepStrictEqual(diagnostics, []);
      });

      it('resolves a preset function in main', async () => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/story-sorts-preset', useJs: true });
        mock.reset();

        assert.deepStrictEqual(evaluateStorySorts(fileContentMock), [
          { order: ['Intro'] },
          { method: 'alphabetical' },
        ]);
      });

      it('does not declare storySorts when main has none', async () => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/all-config-files' });
        mock.reset();

        assert.ok(!fileContentMock.includes('storySorts'));
        assert.ok(
          fileContentMock.includes(
            'updateView(globalThis.view, annotations, normalizedStories, options);'
          )
        );
      });
    });

    describe('when addons are in deviceAddons', () => {
      it('writes the addon imports from deviceAddons', async (t) => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/device-addons' });
        mock.reset();

        assert.strictEqual(
          pathMock,
          path.resolve(__dirname, 'mocks/device-addons/storybook.requires.ts')
        );
        t.assert.snapshot(fileContentMock);
      });
    });

    describe('when main.addons is set', () => {
      it('does not import entries from addons', async () => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/legacy-ondevice-in-addons' });
        mock.reset();

        assert.ok(!fileContentMock.includes('@storybook/addon-ondevice-controls'));
      });

      it('imports deviceAddons and ignores addons when both are set', async () => {
        mock.method(require('fs'), 'writeFileSync', mockFs.writeFileSync);
        await generate({ configPath: 'scripts/mocks/mixed-addons' });
        mock.reset();

        assert.ok(fileContentMock.includes('@storybook/addon-ondevice-controls/register'));
        assert.ok(!fileContentMock.includes('@storybook/addon-ondevice-notes'));
      });
    });
  });
});
