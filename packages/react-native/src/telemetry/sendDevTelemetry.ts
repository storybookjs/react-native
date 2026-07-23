import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { loadMainConfig } from 'storybook/internal/common';
import { setTelemetryEnabled, telemetry } from 'storybook/internal/telemetry';

const RN_FRAMEWORK = '@storybook/react-native';

function getFrameworkName(main: unknown): string | undefined {
  if (main == null || typeof main !== 'object') {
    return undefined;
  }

  const framework = (main as { framework?: unknown }).framework;
  if (typeof framework === 'string') {
    return framework;
  }
  if (
    framework != null &&
    typeof framework === 'object' &&
    typeof (framework as { name?: unknown }).name === 'string'
  ) {
    return (framework as { name: string }).name;
  }

  return undefined;
}

/**
 * Pick JSON-serializable main fields telemetry metadata cares about, and force the RN framework.
 * Used only when the user's main omits `framework`.
 */
function buildTelemetryMain(main: Record<string, unknown> | undefined) {
  return {
    stories: main?.stories ?? [],
    addons: main?.addons,
    deviceAddons: main?.deviceAddons,
    features: main?.features,
    typescript: main?.typescript,
    core: main?.core,
    refs: main?.refs,
    staticDirs: main?.staticDirs,
    framework: RN_FRAMEWORK,
  };
}

/**
 * Send the Storybook `dev` telemetry event for on-device React Native.
 *
 * Why not call `telemetry('dev', {}, { configDir })` directly?
 * `telemetry` builds `metadata.framework` by reading `framework` from the project's main
 * config. Most existing RN apps omit that field (historical CLI template), so a bare call
 * leaves `metadata.framework.name` empty and Metabase cannot attribute usage — even though
 * the event is sent. There is no public option to override metadata, and we must not rewrite
 * the user's main (no codemod).
 *
 * This helper still uses `telemetry` from `storybook/internal/telemetry`. When main already
 * has `framework`, it passes the real `configDir`. When it does not, it points `configDir` at
 * a temporary main that includes `framework: '@storybook/react-native'` for that event only,
 * then deletes the temp dir. Callers must also `setTelemetryEnabled(true)` (done here) because
 * RN does not boot the Storybook core-server that normally resolves telemetry state.
 */
export async function sendDevTelemetry(configPath: string): Promise<void> {
  let tempDir: string | undefined;

  try {
    await setTelemetryEnabled(true);

    const main = (await loadMainConfig({ configDir: configPath }).catch(
      () => undefined
    )) as Record<string, unknown> | undefined;

    let configDir = configPath;

    if (!getFrameworkName(main)) {
      tempDir = mkdtempSync(join(tmpdir(), 'sb-rn-telemetry-'));
      writeFileSync(
        join(tempDir, 'main.js'),
        `module.exports = ${JSON.stringify(buildTelemetryMain(main))};\n`
      );
      configDir = tempDir;
    }

    await telemetry('dev', {}, { configDir, immediate: true });
  } catch {
    // Telemetry must never break Metro / bundler startup.
  } finally {
    if (tempDir) {
      try {
        rmSync(tempDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup failures
      }
    }
  }
}
