import { readChannelServerRecord } from '../metro/channelServerRecord';
import type { DevicesState } from '../metro/deviceControl';
import { CliError } from './errors';

const DEFAULT_PORT = 7007;
/** Extra time on top of the device timeout for the HTTP round trip itself. */
const REQUEST_OVERHEAD_MS = 5000;

export interface ChannelEndpoint {
  url: string;
  /** Where the URL came from, so `status` can explain a wrong guess. */
  source: 'flag' | 'env' | 'record' | 'default';
}

export interface EndpointOptions {
  cwd: string;
  url?: string;
  host?: string;
  port?: number;
  secured?: boolean;
}

function toUrl(host: string, port: number, secured: boolean) {
  const urlHost = host.includes(':') && !host.startsWith('[') ? `[${host}]` : host;
  return `${secured ? 'https' : 'http'}://${urlHost}:${port}`;
}

/**
 * Finds the channel server: explicit flags first, then the STORYBOOK_WS_* variables the bundler
 * also reads, then the record a running server wrote, then the default port.
 */
export function resolveChannelEndpoint(options: EndpointOptions): ChannelEndpoint {
  if (options.url) {
    return { url: options.url.replace(/\/$/, ''), source: 'flag' };
  }

  if (options.host || options.port) {
    return {
      url: toUrl(
        options.host ?? 'localhost',
        options.port ?? DEFAULT_PORT,
        Boolean(options.secured)
      ),
      source: 'flag',
    };
  }

  const STORYBOOK_WS_HOST = process.env.STORYBOOK_WS_HOST;
  const STORYBOOK_WS_PORT = process.env.STORYBOOK_WS_PORT;

  if (STORYBOOK_WS_HOST || STORYBOOK_WS_PORT) {
    const host =
      STORYBOOK_WS_HOST && STORYBOOK_WS_HOST !== 'auto' ? STORYBOOK_WS_HOST : 'localhost';
    const port = STORYBOOK_WS_PORT ? Number(STORYBOOK_WS_PORT) : DEFAULT_PORT;
    return { url: toUrl(host, port, process.env.STORYBOOK_WS_SECURED === 'true'), source: 'env' };
  }

  const record = readChannelServerRecord(options.cwd);

  if (record) {
    return { url: record.url, source: 'record' };
  }

  return { url: toUrl('localhost', DEFAULT_PORT, Boolean(options.secured)), source: 'default' };
}

export function createChannelClient(endpoint: ChannelEndpoint, deviceTimeoutMs: number) {
  const request = async <T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> => {
    let response: Response;
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), deviceTimeoutMs + REQUEST_OVERHEAD_MS);

    try {
      response = await fetch(`${endpoint.url}${path}`, {
        method,
        headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: abort.signal,
      });
    } catch (error) {
      throw new CliError(
        `Could not reach the Storybook channel server at ${endpoint.url}.\n` +
          'Start your app with its bundler, and enable the channel server with the `websockets` ' +
          'or `experimental_mcp` option of `withStorybook` in the Metro (or Re.Pack) config. ' +
          'Pass --port or --url if it runs elsewhere.' +
          (error instanceof Error && error.cause instanceof Error
            ? `\n(${error.cause.message})`
            : ''),
        'unreachable'
      );
    } finally {
      clearTimeout(timer);
    }

    let json: Record<string, unknown>;

    try {
      json = (await response.json()) as Record<string, unknown>;
    } catch {
      throw new CliError(
        `The channel server at ${endpoint.url} answered ${response.status} without JSON. ` +
          'It may be an older @storybook/react-native that does not support this command.'
      );
    }

    if (response.status === 404 && json.error === 'Not found') {
      throw new CliError(
        `The channel server at ${endpoint.url} does not support ${path}. ` +
          'Restart the bundler after upgrading @storybook/react-native.'
      );
    }

    if (!response.ok || json.success === false) {
      throw new CliError(
        typeof json.error === 'string' ? json.error : `Request failed with ${response.status}`,
        typeof json.code === 'string' ? json.code : undefined
      );
    }

    const { success: _success, ...data } = json;
    return data as T;
  };

  return {
    endpoint,
    getState: () => request<DevicesState>('GET', '/state'),
    selectStory: (storyId: string) =>
      request<{ storyId: string }>(
        'POST',
        `/select-story-sync/${encodeURIComponent(storyId)}?timeout=${deviceTimeoutMs}`
      ),
    updateArgs: (body: { storyId?: string; args: Record<string, unknown> }) =>
      request<ArgsResponse>('POST', '/update-args-sync', { ...body, timeout: deviceTimeoutMs }),
    resetArgs: (body: { storyId?: string; argNames?: string[] }) =>
      request<ArgsResponse>('POST', '/reset-args-sync', { ...body, timeout: deviceTimeoutMs }),
    updateGlobals: (body: { globals: Record<string, unknown> }) =>
      request<{ globals: Record<string, unknown> }>('POST', '/update-globals-sync', {
        ...body,
        timeout: deviceTimeoutMs,
      }),
  };
}

export interface ArgsResponse {
  storyId: string;
  args: Record<string, unknown>;
}
