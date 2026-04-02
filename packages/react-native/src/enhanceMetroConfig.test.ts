import type { MetroConfig } from 'metro-config';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

jest.mock('./metro/channelServer', () => ({
  createChannelServer: jest.fn(),
}));

jest.mock('../scripts/generate', () => ({
  generate: jest.fn(),
}));

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
    const { generate } = require('../scripts/generate');

    const result = enhanceMetroConfig(config, {
      configPath: '/tmp/.rnstorybook',
    });

    expect(result.transformer).toBeDefined();
    expect(result.transformer.unstable_allowRequireContext).toBe(true);
    expect(result.resolver).toBeDefined();
    expect(generate).toHaveBeenCalled();
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

    const result = enhanceMetroConfig(
      config,
      { configPath: path.join(tmpDir, '.rnstorybook') },
      { appEntryPoint: appEntry, storybookEntryPoint: sbEntry }
    );

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

    const result = enhanceMetroConfig(config, {
      configPath: '/tmp/.rnstorybook',
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

    // No swapping — returns original resolution
    expect(resolverResult).toEqual({
      filePath: appEntry,
      type: 'sourceFile',
    });

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('creates channel server when websockets provided', () => {
    const { enhanceMetroConfig } = require('./enhanceMetroConfig');
    const { createChannelServer } = require('./metro/channelServer');

    enhanceMetroConfig(config, {
      configPath: '/tmp/.rnstorybook',
      websockets: { host: '10.0.0.5', port: 9999 },
    });

    expect(createChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '10.0.0.5',
        port: 9999,
      })
    );
  });
});
