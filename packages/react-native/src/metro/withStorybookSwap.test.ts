import type { MetroConfig } from 'metro-config';
import { createChannelServer } from './channelServer';
import { generate } from '../../scripts/generate';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

jest.mock('./channelServer', () => ({
  createChannelServer: jest.fn(),
}));

jest.mock('../../scripts/generate', () => ({
  generate: jest.fn(),
}));

jest.mock('storybook/internal/common', () => ({
  optionalEnvToBoolean: jest.fn(() => true),
}));

jest.mock('storybook/internal/telemetry', () => ({
  telemetry: jest.fn(() => Promise.resolve()),
}));

describe('resolveEntryPoint', () => {
  const { resolveEntryPoint } = require('./utils');
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-entry-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('resolves package.json main field (Expo-style)', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ main: 'index.js' })
    );
    fs.writeFileSync(path.join(tmpDir, 'index.js'), '// entry');

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBe(path.join(tmpDir, 'index.js'));
  });

  test('resolves main field without extension', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ main: 'src/entry' })
    );
    fs.mkdirSync(path.join(tmpDir, 'src'));
    fs.writeFileSync(path.join(tmpDir, 'src', 'entry.tsx'), '// entry');

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBe(path.join(tmpDir, 'src', 'entry.tsx'));
  });

  test('falls back to index.js when no package.json exists', () => {
    fs.writeFileSync(path.join(tmpDir, 'index.js'), '// entry');

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBe(path.join(tmpDir, 'index.js'));
  });

  test('falls back to index.ts when no package.json main', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'test-app' })
    );
    fs.writeFileSync(path.join(tmpDir, 'index.ts'), '// entry');

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBe(path.join(tmpDir, 'index.ts'));
  });

  test('detects expo-router entry point', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ main: 'expo-router/entry' })
    );

    // Create node_modules/expo-router/entry.js
    fs.mkdirSync(path.join(tmpDir, 'node_modules', 'expo-router'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, 'node_modules', 'expo-router', 'entry.js'),
      '// expo-router entry'
    );

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBe(
      path.join(tmpDir, 'node_modules', 'expo-router', 'entry.js')
    );
  });

  test('returns undefined when no entry file exists', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ main: 'nonexistent.js' })
    );

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBeUndefined();
  });

  test('resolves main field with .tsx extension', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ main: 'App.tsx' })
    );
    fs.writeFileSync(path.join(tmpDir, 'App.tsx'), '// entry');

    const result = resolveEntryPoint(tmpDir);
    expect(result).toBe(path.join(tmpDir, 'App.tsx'));
  });
});

describe('withStorybookSwap entry-point swapping', () => {
  const config = { resolver: {}, transformer: {} } as MetroConfig;
  let tmpDir: string;

  beforeEach(() => {
    jest.clearAllMocks();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-swap-test-'));
    process.env.STORYBOOK_DISABLE_TELEMETRY = 'true';
  });

  afterEach(() => {
    delete process.env.STORYBOOK_DISABLE_TELEMETRY;
    delete process.env.STORYBOOK_ENABLED;
    fs.rmSync(tmpDir, { recursive: true, force: true });
    jest.resetModules();
  });

  test('swaps entry point when STORYBOOK_ENABLED is true', () => {
    // Setup project structure
    const appEntry = path.join(tmpDir, 'index.js');
    const configDir = path.join(tmpDir, '.rnstorybook');
    const sbEntry = path.join(configDir, 'index.tsx');

    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ main: 'index.js' }));
    fs.writeFileSync(appEntry, '// app entry');
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(sbEntry, '// storybook entry');

    process.env.STORYBOOK_ENABLED = 'true';

    // Re-require to pick up env change
    jest.resetModules();
    jest.mock('./channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));
    const { withStorybookSwap } = require('./withStorybookSwap');

    // Mock cwd to the temp dir
    const origCwd = process.cwd;
    process.cwd = () => tmpDir;

    try {
      const result = withStorybookSwap(config, {
        configPath: configDir,
        enabled: true,
      });

      // Simulate a resolver call that resolves to the app entry
      const mockResolveRequest = jest.fn(() => ({
        filePath: appEntry,
        type: 'sourceFile',
      }));

      const resolverResult = result.resolver.resolveRequest(
        { resolveRequest: mockResolveRequest },
        './index',
        'ios'
      );

      // Entry should be swapped to storybook entry
      expect(resolverResult).toEqual({
        filePath: sbEntry,
        type: 'sourceFile',
      });
    } finally {
      process.cwd = origCwd;
    }
  });

  test('does not swap entry point when STORYBOOK_ENABLED is not set', () => {
    const appEntry = path.join(tmpDir, 'index.js');
    const configDir = path.join(tmpDir, '.rnstorybook');
    const sbEntry = path.join(configDir, 'index.tsx');

    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ main: 'index.js' }));
    fs.writeFileSync(appEntry, '// app entry');
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(sbEntry, '// storybook entry');

    // STORYBOOK_ENABLED is NOT set
    delete process.env.STORYBOOK_ENABLED;

    jest.resetModules();
    jest.mock('./channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));
    const { withStorybookSwap } = require('./withStorybookSwap');

    const origCwd = process.cwd;
    process.cwd = () => tmpDir;

    try {
      const result = withStorybookSwap(config, {
        configPath: configDir,
        enabled: true,
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

      // Entry should NOT be swapped — returns the original app entry
      expect(resolverResult).toEqual({
        filePath: appEntry,
        type: 'sourceFile',
      });
    } finally {
      process.cwd = origCwd;
    }
  });

  test('does not swap entry when enabled is false even if STORYBOOK_ENABLED is true', () => {
    const appEntry = path.join(tmpDir, 'index.js');
    const configDir = path.join(tmpDir, '.rnstorybook');
    const sbEntry = path.join(configDir, 'index.tsx');

    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ main: 'index.js' }));
    fs.writeFileSync(appEntry, '// app entry');
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(sbEntry, '// storybook entry');

    process.env.STORYBOOK_ENABLED = 'true';

    jest.resetModules();
    jest.mock('./channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));
    const { withStorybookSwap } = require('./withStorybookSwap');

    const origCwd = process.cwd;
    process.cwd = () => tmpDir;

    try {
      // enabled: false — storybook is disabled, should not swap
      const result = withStorybookSwap(config, {
        configPath: configDir,
        enabled: false,
      });

      // When disabled, storybook modules are emptied, not swapped
      const mockResolveRequest = jest.fn(() => ({
        filePath: appEntry,
        type: 'sourceFile',
      }));

      const resolverResult = result.resolver.resolveRequest(
        { resolveRequest: mockResolveRequest },
        './index',
        'ios'
      );

      // Should return the original resolution (not swapped)
      expect(resolverResult).toEqual({
        filePath: appEntry,
        type: 'sourceFile',
      });
    } finally {
      process.cwd = origCwd;
    }
  });
});

describe('withStorybookSwap websocket env overrides', () => {
  const config = { resolver: {}, transformer: {} } as MetroConfig;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STORYBOOK_DISABLE_TELEMETRY = 'true';
  });

  afterEach(() => {
    delete process.env.STORYBOOK_DISABLE_TELEMETRY;
    delete process.env.STORYBOOK_WS_HOST;
    delete process.env.STORYBOOK_WS_PORT;
    delete process.env.STORYBOOK_WS_SECURED;
    delete process.env.STORYBOOK_ENABLED;
    jest.resetModules();
  });

  test('overrides websocket host via STORYBOOK_WS_HOST', () => {
    process.env.STORYBOOK_WS_HOST = '10.0.0.5';

    jest.resetModules();
    jest.mock('./channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { createChannelServer: mockCreateChannelServer } = require('./channelServer');
    const { generate: mockGenerate } = require('../../scripts/generate');
    const { withStorybookSwap } = require('./withStorybookSwap');

    withStorybookSwap(config, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
      websockets: { port: 7007 },
    });

    expect(mockCreateChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '10.0.0.5',
        port: 7007,
      })
    );

    expect(mockGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '10.0.0.5',
        port: 7007,
      })
    );
  });

  test('overrides websocket port via STORYBOOK_WS_PORT', () => {
    process.env.STORYBOOK_WS_PORT = '9999';

    jest.resetModules();
    jest.mock('./channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { createChannelServer: mockCreateChannelServer } = require('./channelServer');
    const { withStorybookSwap } = require('./withStorybookSwap');

    withStorybookSwap(config, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
      websockets: 'auto',
    });

    // 'auto' becomes an object when env overrides are present
    expect(mockCreateChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 9999,
      })
    );
  });

  test('overrides websocket secured via STORYBOOK_WS_SECURED', () => {
    process.env.STORYBOOK_WS_SECURED = 'true';

    jest.resetModules();
    jest.mock('./channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { createChannelServer: mockCreateChannelServer } = require('./channelServer');
    const { generate: mockGenerate } = require('../../scripts/generate');
    const { withStorybookSwap } = require('./withStorybookSwap');

    withStorybookSwap(config, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
      websockets: { port: 7007 },
    });

    expect(mockCreateChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        secured: true,
      })
    );

    expect(mockGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        secured: true,
      })
    );
  });

  test('does not override websockets when no env variables are set', () => {
    jest.resetModules();
    jest.mock('./channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { createChannelServer: mockCreateChannelServer } = require('./channelServer');
    const { withStorybookSwap } = require('./withStorybookSwap');

    withStorybookSwap(config, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
      websockets: 'auto',
    });

    // 'auto' should remain as-is, producing defaults
    expect(mockCreateChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 7007,
      })
    );
  });

  test('creates websockets from env variables even when no websockets option provided', () => {
    process.env.STORYBOOK_WS_HOST = '192.168.1.1';
    process.env.STORYBOOK_WS_PORT = '8080';

    jest.resetModules();
    jest.mock('./channelServer', () => ({ createChannelServer: jest.fn() }));
    jest.mock('../../scripts/generate', () => ({ generate: jest.fn() }));
    jest.mock('storybook/internal/common', () => ({ optionalEnvToBoolean: jest.fn(() => true) }));
    jest.mock('storybook/internal/telemetry', () => ({
      telemetry: jest.fn(() => Promise.resolve()),
    }));

    const { createChannelServer: mockCreateChannelServer } = require('./channelServer');
    const { generate: mockGenerate } = require('../../scripts/generate');
    const { withStorybookSwap } = require('./withStorybookSwap');

    // No websockets option provided
    withStorybookSwap(config, {
      configPath: '/tmp/.rnstorybook',
      enabled: true,
    });

    // Should create channel server with env-provided values
    expect(mockCreateChannelServer).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '192.168.1.1',
        port: 8080,
      })
    );

    expect(mockGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '192.168.1.1',
        port: 8080,
      })
    );
  });
});
