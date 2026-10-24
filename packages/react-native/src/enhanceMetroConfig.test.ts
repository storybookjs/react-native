import type { MetroConfig } from 'metro-config';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

describe('enhanceMetroConfig', () => {
  const config = { resolver: {}, transformer: {} } as MetroConfig;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('returns metro config with transformer and resolver', () => {
    const { enhanceMetroConfig } = require('./enhanceMetroConfig');

    const result = enhanceMetroConfig(config);

    expect(result.transformer).toBeDefined();
    expect(result.transformer.unstable_allowRequireContext).toBe(true);
    expect(result.resolver).toBeDefined();
  });

  test('swaps entry point when swap data is provided', () => {
    let tmpDir: string;
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-metro-test-'));

    const appEntry = path.join(tmpDir, 'index.js');
    const sbEntry = path.join(tmpDir, '.rnstorybook', 'index.tsx');

    fs.writeFileSync(appEntry, '// app entry');
    fs.mkdirSync(path.join(tmpDir, '.rnstorybook'), { recursive: true });
    fs.writeFileSync(sbEntry, '// storybook entry');

    const { enhanceMetroConfig } = require('./enhanceMetroConfig');

    const result = enhanceMetroConfig(config, {
      swap: { appEntryPoint: appEntry, storybookEntryPoint: sbEntry },
    });

    const mockResolveRequest = jest.fn(() => ({
      filePath: appEntry,
      type: 'sourceFile',
    }));

    const resolverResult = result.resolver.resolveRequest(
      { resolveRequest: mockResolveRequest },
      './index',
      'ios'
    );

    expect(resolverResult).toEqual({
      filePath: sbEntry,
      type: 'sourceFile',
    });

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('does not swap when no swap data provided', () => {
    let tmpDir: string;
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-metro-test-'));

    const appEntry = path.join(tmpDir, 'index.js');
    fs.writeFileSync(appEntry, '// app entry');

    const { enhanceMetroConfig } = require('./enhanceMetroConfig');

    const result = enhanceMetroConfig(config);

    const mockResolveRequest = jest.fn(() => ({
      filePath: appEntry,
      type: 'sourceFile',
    }));

    const resolverResult = result.resolver.resolveRequest(
      { resolveRequest: mockResolveRequest },
      './index',
      'ios'
    );

    // No swapping — returns original resolution
    expect(resolverResult).toEqual({
      filePath: appEntry,
      type: 'sourceFile',
    });

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('entry-point swapping at transform time', () => {
    const swap = {
      appEntryPoint: path.resolve('/tmp/proj/index.js'),
      storybookEntryPoint: path.resolve('/tmp/proj/.rnstorybook/index.tsx'),
    };
    const projectRoot = path.resolve('/tmp/proj');

    /** The worker `enhanceMetroConfig` points Metro at: the one next to its own file. */
    const storybookWorker = () => require.resolve('./metro/storybookTransformWorker');

    /** Watch how the worker Storybook has to chain to is looked up. */
    function watchWorkerResolution() {
      const resolution = require('./metro/resolveMetroWorker');
      const actual = resolution.resolveUpstreamTransformerPath;
      return jest
        .spyOn(resolution, 'resolveUpstreamTransformerPath')
        .mockImplementation(actual as any);
    }

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('points Metro at the Storybook transform worker when swapping', () => {
      const { enhanceMetroConfig } = require('./enhanceMetroConfig');

      const result = enhanceMetroConfig({ ...config, projectRoot }, { swap });

      expect(result.transformerPath).toBe(storybookWorker());
      expect(typeof require(result.transformerPath).transform).toBe('function');
      expect(typeof require(result.transformerPath).getCacheKey).toBe('function');
    });

    test('asks for the worker Metro would load, from the project the config names', () => {
      const resolve = watchWorkerResolution();
      const { enhanceMetroConfig } = require('./enhanceMetroConfig');

      enhanceMetroConfig({ ...config, projectRoot }, { swap });

      expect(resolve).toHaveBeenCalledWith('metro-transform-worker', projectRoot);
    });

    test('chains to the worker the app configured rather than the default', () => {
      const resolve = watchWorkerResolution();
      const { enhanceMetroConfig } = require('./enhanceMetroConfig');
      const customWorker = path.join(projectRoot, 'node_modules', 'nativewind', 'metro.js');

      const result = enhanceMetroConfig(
        { ...config, projectRoot, transformerPath: customWorker },
        {
          swap,
        }
      );

      expect(resolve).toHaveBeenCalledWith(customWorker, projectRoot);
      expect(result.transformer.storybookEntrySwap.upstreamTransformerPath).toBe(
        resolve.mock.results[0].value
      );
      expect(result.transformerPath).toBe(storybookWorker());
    });

    test('uses the working directory when the config has no project root', () => {
      const resolve = watchWorkerResolution();
      const { enhanceMetroConfig } = require('./enhanceMetroConfig');

      enhanceMetroConfig(config, { swap });

      expect(resolve).toHaveBeenCalledWith('metro-transform-worker', process.cwd());
    });

    test('leaves the config alone and warns when the worker cannot be found', () => {
      const resolution = require('./metro/resolveMetroWorker');
      jest.spyOn(resolution, 'resolveUpstreamTransformerPath').mockReturnValue(undefined);
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const { enhanceMetroConfig } = require('./enhanceMetroConfig');

      const result = enhanceMetroConfig({ ...config, projectRoot }, { swap });

      // Metro may well be happy with the worker it was given, so a config that still
      // loads beats a swap that throws: only bundling loses out, and that is warned.
      expect(result.transformerPath).toBeUndefined();
      expect('storybookEntrySwap' in result.transformer).toBe(false);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain('react-native bundle');

      // The dev server keeps swapping through the resolver.
      expect(
        result.resolver.resolveRequest(
          { resolveRequest: jest.fn(() => ({ filePath: swap.appEntryPoint, type: 'sourceFile' })) },
          './index',
          'ios'
        )
      ).toEqual({ filePath: swap.storybookEntryPoint, type: 'sourceFile' });
    });

    test('reuses the recorded worker when withStorybook is applied twice', () => {
      const resolve = watchWorkerResolution();
      const { enhanceMetroConfig } = require('./enhanceMetroConfig');

      const first = enhanceMetroConfig({ ...config, projectRoot }, { swap });
      resolve.mockClear();
      const second = enhanceMetroConfig(first, { swap });

      // Chaining to itself would loop, so the worker the first pass replaced is kept.
      expect(resolve).not.toHaveBeenCalled();
      expect(second.transformerPath).toBe(first.transformerPath);
      expect(second.transformer.storybookEntrySwap).toEqual(first.transformer.storybookEntrySwap);
      expect(second.transformer.storybookEntrySwap.upstreamTransformerPath).not.toBe(
        first.transformerPath
      );
    });

    test('never points the upstream worker at the Storybook worker', () => {
      const resolve = watchWorkerResolution();
      const { enhanceMetroConfig } = require('./enhanceMetroConfig');

      const result = enhanceMetroConfig(
        { ...config, projectRoot, transformerPath: storybookWorker() },
        { swap }
      );

      // A hand-copied config leaves no trace of the worker Storybook replaced, so the
      // only worker that cannot be Storybook's own is Metro's default.
      expect(resolve).toHaveBeenCalledWith('metro-transform-worker', projectRoot);
      expect(result.transformer.storybookEntrySwap.upstreamTransformerPath).not.toBe(
        storybookWorker()
      );
    });

    test('leaves the transformer alone when there is no swap', () => {
      const resolve = watchWorkerResolution();
      const { enhanceMetroConfig } = require('./enhanceMetroConfig');
      const customWorker = require.resolve('metro-babel-transformer');

      const result = enhanceMetroConfig({ ...config, projectRoot, transformerPath: customWorker });

      expect(resolve).not.toHaveBeenCalled();
      expect(result.transformerPath).toBe(customWorker);
      expect('storybookEntrySwap' in result.transformer).toBe(false);
    });
  });
});
