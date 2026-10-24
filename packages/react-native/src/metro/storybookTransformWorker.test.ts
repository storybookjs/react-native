import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  getCacheKey,
  storybookEntrySource,
  transform,
  type StorybookTransformWorkerConfig,
} from './storybookTransformWorker';

const UPSTREAM_TRANSFORMER = require.resolve('metro-transform-worker');

/**
 * The transformer config Metro would hand over for a stock project, minus the
 * three keys Metro strips. `metro-config` is not imported here because loading it
 * drags in an ESM-only dependency that this jest setup does not transform.
 */
const METRO_TRANSFORMER_CONFIG = {
  assetPlugins: [],
  asyncRequireModulePath: 'metro-runtime/src/modules/asyncRequire',
  assetRegistryPath: 'missing-asset-registry-path',
  babelTransformerPath: require.resolve('metro-babel-transformer'),
  dynamicDepsInPackages: 'throwAtRuntime',
  enableBabelRCLookup: false,
  enableBabelRuntime: true,
  globalPrefix: '',
  hermesParser: false,
  minifierConfig: {},
  minifierPath: require.resolve('metro-minify-terser'),
  optimizationSizeLimit: 150 * 1024,
  publicPath: '/assets',
  allowOptionalDependencies: false,
  unstable_allowRequireContext: true,
  unstable_dependencyMapReservedName: null,
  unstable_disableModuleWrapping: false,
  unstable_disableNormalizePseudoGlobals: false,
  unstable_memoizeInlineRequires: false,
  unstable_renameRequire: true,
} as unknown as StorybookTransformWorkerConfig;

/**
 * `react-native bundle` resolves the entry to an absolute path instead of asking
 * `resolver.resolveRequest`, so the swap has to happen in the transform worker.
 * These tests chain through the real `metro-transform-worker` to prove the entry
 * is rewritten and every other file still reaches Metro untouched.
 */
describe('storybookTransformWorker', () => {
  let projectRoot: string;
  let appEntryPoint: string;
  let storybookEntryPoint: string;

  beforeAll(async () => {
    projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-entry-swap-'));
    fs.mkdirSync(path.join(projectRoot, '.rnstorybook'), { recursive: true });
    fs.writeFileSync(
      path.join(projectRoot, 'index.js'),
      "const greeting = 'APP-ENTRY-MARKER';\nmodule.exports = greeting;\n"
    );
    fs.writeFileSync(
      path.join(projectRoot, 'appCode.js'),
      "const greeting = 'APP-MODULE-MARKER';\nmodule.exports = greeting;\n"
    );
    fs.writeFileSync(
      path.join(projectRoot, '.rnstorybook', 'index.js'),
      "const greeting = 'STORYBOOK-ENTRY-MARKER';\nmodule.exports = greeting;\n"
    );
    appEntryPoint = path.join(projectRoot, 'index.js');
    storybookEntryPoint = path.join(projectRoot, '.rnstorybook', 'index.js');
  });

  afterAll(() => {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  });

  function workerConfig(): StorybookTransformWorkerConfig {
    return { ...METRO_TRANSFORMER_CONFIG };
  }

  const transformOptions = {
    type: 'module',
    dev: true,
    minify: false,
    platform: 'ios',
    customTransformOptions: {},
    unstable_transformProfile: 'default',
  };

  /** `transform` returns Metro's transform result; the code lives in `output`. */
  function transformedCode(result: any): string {
    const first = Array.isArray(result.output) ? result.output[0] : result.output;
    return first?.data?.code ?? first?.code ?? '';
  }

  function dependencyNames(result: any): string[] {
    return (result.dependencies ?? []).map((dependency: any) =>
      typeof dependency === 'string' ? dependency : dependency.name
    );
  }

  test('rewrites the app entry into an import of the Storybook entry', async () => {
    const config: StorybookTransformWorkerConfig = {
      ...workerConfig(),
      storybookEntrySwap: {
        appEntryPoint,
        storybookEntryPoint,
        upstreamTransformerPath: UPSTREAM_TRANSFORMER,
      },
    };

    const output: any = await transform(
      config,
      projectRoot,
      path.relative(projectRoot, appEntryPoint),
      fs.readFileSync(appEntryPoint),
      transformOptions
    );

    expect(transformedCode(output)).not.toContain('APP-ENTRY-MARKER');
    expect(dependencyNames(output)).toContain('./.rnstorybook/index.js');
  });

  test('leaves every other file to the configured transformer', async () => {
    const config: StorybookTransformWorkerConfig = {
      ...workerConfig(),
      storybookEntrySwap: {
        appEntryPoint,
        storybookEntryPoint,
        upstreamTransformerPath: UPSTREAM_TRANSFORMER,
      },
    };

    const output: any = await transform(
      config,
      projectRoot,
      'appCode.js',
      fs.readFileSync(path.join(projectRoot, 'appCode.js')),
      transformOptions
    );

    expect(transformedCode(output)).toContain('APP-MODULE-MARKER');
    expect(transformedCode(output)).not.toContain('.rnstorybook');
  });

  test('refuses to run without a swap description', async () => {
    // Falling back to a default worker here would drop the swap, and any wrapper in
    // front of it, without anyone noticing.
    const config = workerConfig();

    await expect(
      transform(config, projectRoot, 'index.js', fs.readFileSync(appEntryPoint), transformOptions)
    ).rejects.toThrow(/storybookEntrySwap/);
    // Metro asks for a cache key before it ever calls `transform`.
    expect(() => getCacheKey(config)).toThrow(/storybookEntrySwap/);
  });

  test('keeps the storybookEntrySwap key away from the upstream transformer', async () => {
    // `.cjs` so jest's transform pipeline leaves the plain CommonJS file alone.
    const upstream = path.join(projectRoot, 'recordingTransformer.cjs');
    const log = path.join(projectRoot, 'seen-config.json');
    fs.writeFileSync(
      upstream,
      'const fs = require("fs");\n' +
        'exports.transform = async (config, root, filename, data) => {\n' +
        '  fs.writeFileSync(' +
        JSON.stringify(log) +
        ', JSON.stringify({ keys: Object.keys(config), data: data.toString("utf8") }));\n' +
        '  return { code: "ok" };\n' +
        '};\n' +
        "exports.getCacheKey = () => 'upstream-key';\n"
    );

    const config: StorybookTransformWorkerConfig = {
      someOtherSetting: true,
      storybookEntrySwap: {
        appEntryPoint,
        storybookEntryPoint,
        upstreamTransformerPath: upstream,
      },
    };

    await transform(
      config,
      projectRoot,
      'index.js',
      fs.readFileSync(appEntryPoint),
      transformOptions
    );

    const seen = JSON.parse(fs.readFileSync(log, 'utf8'));
    expect(seen.keys).not.toContain('storybookEntrySwap');
    expect(seen.keys).toContain('someOtherSetting');
    // the rewrite happens before delegating, so the upstream sees the swapped source
    expect(seen.data).toContain('./.rnstorybook/index.js');
  });

  describe('getCacheKey', () => {
    /** A worker of our own, so its key can be spotted inside ours. */
    function writeUpstream(name: string, key: string): string {
      const upstream = path.join(projectRoot, name);
      fs.writeFileSync(
        upstream,
        'exports.transform = async () => ({ code: "ok" });\n' +
          `exports.getCacheKey = () => '${key}';\n`
      );
      return upstream;
    }

    function keyFor(upstreamTransformerPath: string, story = storybookEntryPoint) {
      return getCacheKey(
        {
          ...workerConfig(),
          storybookEntrySwap: {
            appEntryPoint,
            storybookEntryPoint: story,
            upstreamTransformerPath,
          },
        },
        { projectRoot }
      );
    }

    test('folds the swap and the upstream worker in, without machine-specific paths', () => {
      const upstream = writeUpstream('upstreamWorker.cjs', 'upstream-key');

      const key = keyFor(upstream);
      expect(key).toContain('index.js');
      expect(key).toContain(path.posix.join('.rnstorybook', 'index.js'));
      expect(key).toContain('upstreamWorker.cjs');
      expect(key).toContain('upstream-key');
      expect(key).not.toContain(projectRoot);

      // Chaining through the real worker has to carry its key, which covers every setting
      // Metro transforms with.
      const metroKey = require(UPSTREAM_TRANSFORMER).getCacheKey(workerConfig(), { projectRoot });
      expect(keyFor(UPSTREAM_TRANSFORMER)).toContain(metroKey);
    });

    test('changes when the swap or the worker it chains to changes', () => {
      const otherUpstream = writeUpstream('otherUpstreamWorker.cjs', 'other-upstream-key');
      const otherStorybook = path.join(projectRoot, '.storybook-other', 'index.tsx');

      expect(keyFor(UPSTREAM_TRANSFORMER)).not.toBe(keyFor(otherUpstream));
      expect(keyFor(UPSTREAM_TRANSFORMER, otherStorybook)).not.toBe(keyFor(UPSTREAM_TRANSFORMER));
    });
  });

  describe('storybookEntrySource', () => {
    test('uses a POSIX relative specifier', () => {
      expect(
        storybookEntrySource(
          path.join('/tmp', 'proj', 'index.js'),
          path.join('/tmp', 'proj', '.rnstorybook', 'index.tsx')
        )
      ).toContain('require("./.rnstorybook/index.tsx")');
    });

    test('walks up when the Storybook config sits outside the project', () => {
      expect(
        storybookEntrySource(
          path.join('/tmp', 'proj', 'app', 'index.js'),
          path.join('/tmp', 'proj', '.rnstorybook', 'index.tsx')
        )
      ).toContain('require("../.rnstorybook/index.tsx")');
    });

    test('uses forward slashes for Windows paths', () => {
      expect(
        storybookEntrySource(
          'C:\\projects\\app\\index.js',
          'C:\\projects\\app\\.rnstorybook\\index.tsx',
          path.win32
        )
      ).toContain('require("./.rnstorybook/index.tsx")');
    });

    test('falls back to an absolute specifier across Windows drives', () => {
      expect(
        storybookEntrySource('C:\\projects\\app\\index.js', 'D:\\sb\\index.tsx', path.win32)
      ).toContain('require("D:/sb/index.tsx")');
    });
  });
});
