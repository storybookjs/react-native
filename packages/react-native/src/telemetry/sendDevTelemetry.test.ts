import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { loadMainConfig } from 'storybook/internal/common';
import { setTelemetryEnabled, telemetry } from 'storybook/internal/telemetry';

import { sendDevTelemetry } from './sendDevTelemetry';

jest.mock('storybook/internal/common', () => ({
  loadMainConfig: jest.fn(),
}));

jest.mock('storybook/internal/telemetry', () => ({
  setTelemetryEnabled: jest.fn(() => Promise.resolve()),
  telemetry: jest.fn(() => Promise.resolve()),
}));

describe('sendDevTelemetry', () => {
  const configPath = '/tmp/.rnstorybook';

  beforeEach(() => {
    jest.clearAllMocks();
    (setTelemetryEnabled as jest.Mock).mockResolvedValue(undefined);
    (telemetry as jest.Mock).mockResolvedValue(undefined);
  });

  test('uses the real configDir when main already declares framework', async () => {
    (loadMainConfig as jest.Mock).mockResolvedValue({
      stories: [],
      framework: '@storybook/react-native',
    });

    await sendDevTelemetry(configPath);

    expect(setTelemetryEnabled).toHaveBeenCalledWith(true);
    expect(telemetry).toHaveBeenCalledWith(
      'dev',
      {},
      expect.objectContaining({ configDir: configPath, immediate: true })
    );
  });

  test('materializes a temporary main with framework when user main omits it', async () => {
    (loadMainConfig as jest.Mock).mockResolvedValue({
      stories: ['**/*.stories.tsx'],
      deviceAddons: ['@storybook/addon-ondevice-controls'],
    });

    let capturedConfigDir: string | undefined;
    (telemetry as jest.Mock).mockImplementation(async (_event, _payload, options) => {
      capturedConfigDir = options.configDir;
      const mainPath = join(options.configDir, 'main.js');
      expect(existsSync(mainPath)).toBe(true);
      const source = readFileSync(mainPath, 'utf8');
      expect(source).toContain('"@storybook/react-native"');
      expect(source).toContain('**/*.stories.tsx');
      expect(source).toContain('@storybook/addon-ondevice-controls');
    });

    await sendDevTelemetry(configPath);

    expect(capturedConfigDir).toBeDefined();
    expect(capturedConfigDir).not.toBe(configPath);
    // temp dir is cleaned up after send
    expect(existsSync(capturedConfigDir!)).toBe(false);
  });

  test('never throws when telemetry internals fail', async () => {
    (loadMainConfig as jest.Mock).mockRejectedValue(new Error('boom'));
    (setTelemetryEnabled as jest.Mock).mockRejectedValue(new Error('boom'));

    await expect(sendDevTelemetry(configPath)).resolves.toBeUndefined();
  });
});
