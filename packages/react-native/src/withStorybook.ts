import * as path from 'path';
import type { MetroConfig } from 'metro-config';
import { enhanceMetroConfig } from './enhanceMetroConfig';
import { enhanceRepackConfig } from './enhanceRepackConfig';
import { resolveEntryPoint, resolveStorybookEntry } from './metro/utils';
import type { WithStorybookOptions } from './metro/utils';
import type { WebsocketsOptions } from './types';
import { generate } from '../scripts/generate';
import { createChannelServer } from './metro/channelServer';

function envVariableToBoolean(value: string | undefined, defaultValue: any = false): boolean {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return !!defaultValue;
  }
}
function envVariableToString(
  value: string | undefined,
  defaultValue: string | undefined
): string | undefined {
  return value ?? defaultValue;
}
function envVariableToNumber(value: string | undefined, defaultValue: number): number {
  const parsed = parseInt(value ?? '', 10);
  if (!isNaN(parsed)) {
    return parsed;
  }
  return defaultValue;
}

function isMetroConfig(config: unknown): config is MetroConfig {
  return config != null && typeof config === 'object' && 'transformer' in config;
}

function loadWebsocketEnvOverrides(
  websockets: WebsocketsOptions | 'auto' | undefined
): WebsocketsOptions {
  const envHost = envVariableToString(
    process.env.STORYBOOK_WS_HOST,
    websockets === 'auto' ? undefined : (websockets?.host ?? undefined)
  );
  const envPort = envVariableToNumber(
    process.env.STORYBOOK_WS_PORT,
    websockets === 'auto' ? 7007 : (websockets?.port ?? 7007)
  );
  const envSecured = envVariableToBoolean(process.env.STORYBOOK_WS_SECURED);

  if (websockets === undefined && !envHost) {
    return {
      host: undefined,
      port: undefined,
      secured: false,
    };
  }

  const config: WebsocketsOptions =
    websockets === 'auto' || websockets === undefined ? {} : { ...websockets };

  if (envHost) {
    config.host = envHost;
  }

  if (envPort) {
    config.port = envPort;
  }

  if (envSecured) {
    config.secured = true;
  }

  return config;
}

export function withStorybook<T>(config: T, options: WithStorybookOptions = {}): T {
  const enabled = envVariableToBoolean(process.env.STORYBOOK_ENABLED, false);
  if (!enabled) {
    return config;
  }
  const server = envVariableToBoolean(process.env.STORYBOOK_SERVER, true);
  const liteMode = envVariableToBoolean(
    process.env.STORYBOOK_DISABLE_UI,
    options.liteMode ?? false
  );
  const settings = { ...options };

  if (!server) {
    settings.experimental_mcp = false;
  }

  if (liteMode) {
    settings.docTools = false;
  }

  const defaultConfigPath = path.resolve(process.cwd(), './.rnstorybook');
  const configPath = options.configPath || defaultConfigPath;
  const websocketsOption = options.websockets;
  const resolvedWs = loadWebsocketEnvOverrides(websocketsOption);

  const appEntryPoint = resolveEntryPoint();
  const storybookEntryPoint = resolveStorybookEntry(configPath);
  const swap =
    appEntryPoint && storybookEntryPoint ? { appEntryPoint, storybookEntryPoint } : undefined;

  // Shared setup: generate + createChannelServer (used by both Metro and Repack)
  const { useJs = false, docTools = true, experimental_mcp = false } = settings;

  const bindHost =
    websocketsOption === 'auto' && !process.env.STORYBOOK_WS_HOST ? undefined : resolvedWs.host;
  const generateHost =
    resolvedWs.host ??
    (websocketsOption === 'auto' && !process.env.STORYBOOK_WS_HOST ? 'auto' : undefined);
  const port = resolvedWs.port ?? 7007;
  const secured = resolvedWs.secured;
  const channelWebsocketsEnabled =
    Boolean(websocketsOption) ||
    Boolean(process.env.STORYBOOK_WS_HOST) ||
    Boolean(resolvedWs.host);

  if (server || experimental_mcp) {
    createChannelServer({
      port,
      host: bindHost,
      configPath,
      experimental_mcp,
      websockets: channelWebsocketsEnabled,
      secured,
      ssl:
        websocketsOption &&
        websocketsOption !== 'auto' &&
        secured
          ? {
              key: websocketsOption.key,
              cert: websocketsOption.cert,
              ca: websocketsOption.ca,
              passphrase: websocketsOption.passphrase,
            }
          : undefined,
    });
  }

  generate({
    configPath,
    useJs,
    docTools,
    liteMode,
    ...(websocketsOption != null || process.env.STORYBOOK_WS_HOST
      ? { host: generateHost, port, secured }
      : {}),
  });

  if (isMetroConfig(config)) {
    return enhanceMetroConfig(config, { swap }) as unknown as T;
  }

  return enhanceRepackConfig(config as Record<string, any>, { swap }) as T;
}
