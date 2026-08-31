import type { WebsocketsOptions } from './types';

export function envVariableToBoolean(
  value: string | undefined,
  defaultValue: any = false
): boolean {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return !!defaultValue;
  }
}

export function envVariableToString(
  value: string | undefined,
  defaultValue: string | undefined
): string | undefined {
  return value ?? defaultValue;
}

export function envVariableToNumber(value: string | undefined, defaultValue: number): number {
  const parsed = parseInt(value ?? '', 10);
  if (!isNaN(parsed)) {
    return parsed;
  }
  return defaultValue;
}

export function loadWebsocketEnvOverrides(
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
