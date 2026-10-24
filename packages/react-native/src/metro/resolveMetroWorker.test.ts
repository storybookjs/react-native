import * as os from 'os';
import * as path from 'path';
import {
  resolveFromDirectory,
  resolveUpstreamTransformerPath,
  type ResolveFromDirectory,
} from './resolveMetroWorker';

const WORKER = 'metro-transform-worker';
const CLI_PLUGIN = path.join('@react-native', 'community-cli-plugin');

/**
 * The layouts the worker has to survive — a hoisted copy above the running Metro, a chain
 * where nothing below `react-native` is visible to the app — are install layouts, so they are
 * covered against a real `node_modules` tree in `tests/scripts/bundleEntrySwap.test.ts`.
 */
describe('resolveUpstreamTransformerPath', () => {
  test('searches for Metro through react-native and its CLI plugin before the app', () => {
    // react-native is there, Metro is nowhere: react-native does not depend on Metro, only
    // the CLI plugin that runs the bundler does, and the app can have its own copy.
    const lookups: ResolveFromDirectory = jest.fn((directory: string, specifier: string) =>
      specifier === 'react-native/package.json'
        ? path.join(directory, 'node_modules', 'react-native', 'package.json')
        : undefined
    );

    expect(resolveUpstreamTransformerPath(WORKER, '/app', lookups)).toBeUndefined();
    expect(lookups.mock.calls).toEqual([
      ['/app', 'react-native/package.json'],
      [path.join('/app', 'node_modules', 'react-native'), `${CLI_PLUGIN}/package.json`],
      ['/app', 'metro/package.json'],
    ]);
  });

  test('keeps an absolute worker as it is without looking for it', () => {
    const expoWorker = path.join('/app', 'node_modules', 'expo', 'metro-transform-worker.js');
    const neverCalled: ResolveFromDirectory = jest.fn(() => {
      throw new Error('an absolute path has nothing left to resolve');
    });

    expect(resolveUpstreamTransformerPath(expoWorker, '/app', neverCalled)).toBe(expoWorker);
    expect(neverCalled).not.toHaveBeenCalled();
  });
});

describe('resolveFromDirectory', () => {
  test('finds a real package from the directory it is given', () => {
    const metroPackage = resolveFromDirectory(process.cwd(), 'metro/package.json');

    expect(metroPackage).toBeDefined();
    expect(resolveFromDirectory(path.dirname(metroPackage!), 'metro/package.json')).toBe(
      metroPackage
    );
  });

  test('reports a miss instead of throwing', () => {
    expect(resolveFromDirectory(os.tmpdir(), 'storybook-does-not-exist-anywhere')).toBeUndefined();
  });
});
