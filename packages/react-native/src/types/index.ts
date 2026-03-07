import type { LoaderFunction } from 'storybook/internal/types';

export interface RequireContext {
  keys: () => string[];
  (id: string): any;
  resolve(id: string): string;
}

export type Loadable = RequireContext | RequireContext[] | LoaderFunction;

/**
 * Options for configuring WebSockets used for syncing storybook instances or sending events to storybook.
 */
export interface WebsocketsOptions {
  /**
   * The port WebSocket server will listen on. Defaults to 7007.
   */
  port?: number;

  /**
   * The host WebSocket server will bind to. Defaults to 'localhost'.
   */
  host?: string;

  /**
   * Whether to use WSS/HTTPS for the channel server.
   */
  secured?: boolean;

  /**
   * TLS private key used when `secured` is true.
   */
  key?: string | Buffer;

  /**
   * TLS certificate used when `secured` is true.
   */
  cert?: string | Buffer;

  /**
   * Optional certificate authority chain used when `secured` is true.
   */
  ca?: string | Buffer | Array<string | Buffer>;

  /**
   * Optional TLS passphrase used when `secured` is true.
   */
  passphrase?: string;
}
