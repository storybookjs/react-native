import * as path from 'path';
import type { MetroConfig } from 'metro-config';
import { enhanceMetroConfig } from './enhanceMetroConfig';
import { enhanceRepackConfig } from './enhanceRepackConfig';
import { resolveEntryPoint, resolveStorybookEntry } from './metro/utils';
import type { WithStorybookOptions } from './metro/utils';
import type { WebsocketsOptions } from './types';
import { generate } from '../scripts/generate';
import { createChannelServer } from './metro/channelServer';

function isMetroConfig(config: unknown): config is MetroConfig {
  return config != null && typeof config === 'object' && 'transformer' in config;
}

function loadWebsocketEnvOverrides(
  websockets: WebsocketsOptions | 'auto' | undefined
): WebsocketsOptions | 'auto' | undefined {
  const envHost = process.env.STORYBOOK_WS_HOST;
  const envPort = process.env.STORYBOOK_WS_PORT;
  const envSecured = process.env.STORYBOOK_WS_SECURED;

  if (!envHost && !envPort && !envSecured) {
    return websockets;
  }

  const base: WebsocketsOptions =
    websockets === 'auto' || websockets === undefined ? {} : { ...websockets };

  if (envHost) {
    base.host = envHost;
  }

  if (envPort) {
    const parsed = parseInt(envPort, 10);

    if (!isNaN(parsed)) {
      base.port = parsed;
    }
  }

  if (envSecured) {
    base.secured = envSecured === 'true';
  }

  return base;
}

export function withStorybook<T>(config: T, options: WithStorybookOptions = {}): T {
  if (process.env.STORYBOOK_ENABLED !== 'true') {
    return config;
  }

  const defaultConfigPath = path.resolve(process.cwd(), './.rnstorybook');
  const configPath = options.configPath || defaultConfigPath;
  const websockets = loadWebsocketEnvOverrides(options.websockets);
  const resolvedOptions: WithStorybookOptions = { ...options, configPath, websockets };

  const appEntryPoint = resolveEntryPoint();
  const storybookEntryPoint = resolveStorybookEntry(configPath);
  const swap =
    appEntryPoint && storybookEntryPoint
      ? { appEntryPoint, storybookEntryPoint }
      : undefined;

  // Shared setup: generate + createChannelServer (used by both Metro and Repack)
  const {
    useJs = false,
    docTools = true,
    experimental_mcp = false,
  } = resolvedOptions;

  const wsOpts = websockets && websockets !== 'auto' ? websockets : undefined;
  const port = websockets === 'auto' ? 7007 : (wsOpts?.port ?? 7007);
  const host = websockets === 'auto' ? 'auto' : wsOpts?.host;
  const secured = Boolean(wsOpts?.secured);

  if (websockets || experimental_mcp) {
    createChannelServer({
      port,
      host: host === 'auto' ? undefined : host,
      configPath,
      experimental_mcp,
      websockets: Boolean(websockets),
      secured,
      ssl: wsOpts
        ? { key: wsOpts.key, cert: wsOpts.cert, ca: wsOpts.ca, passphrase: wsOpts.passphrase }
        : undefined,
    });
  }

  generate({
    configPath,
    useJs,
    docTools,
    ...(websockets ? { host, port, secured } : {}),
  });

  if (isMetroConfig(config)) {
    return enhanceMetroConfig(config, { liteMode: resolvedOptions.liteMode }, swap) as unknown as T;
  }

  return enhanceRepackConfig(config as Record<string, any>, swap) as T;
}
