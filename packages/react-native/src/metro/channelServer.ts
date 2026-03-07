import { WebSocketServer, WebSocket, Data } from 'ws';
import { createServer as createHttpServer, IncomingMessage, ServerResponse } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { buildIndex } from './buildIndex';
import { createMcpHandler } from './mcpServer';
import { createSelectStorySyncEndpoint, SELECT_STORY_SYNC_ROUTE } from './selectStorySyncEndpoint';

interface ChannelServerSecureOptions {
  ca?: string | Buffer | Array<string | Buffer>;
  cert?: string | Buffer | Array<string | Buffer>;
  key?: string | Buffer | Array<string | Buffer>;
  passphrase?: string;
}

/**
 * Options for creating a channel server.
 */
interface ChannelServerOptions {
  /**
   * The port the server will listen on.
   */
  port?: number;

  /**
   * The host the server will bind to.
   */
  host?: string;

  /**
   * The path to the Storybook config folder.
   */
  configPath: string;

  /**
   * Whether to enable MCP (Model Context Protocol) server support.
   * When enabled, adds an /mcp endpoint.
   */
  experimental_mcp?: boolean;

  /**
   * Whether to enable WebSocket support.
   * When false, starts only the HTTP server endpoints.
   */
  websockets?: boolean;

  /**
   * Whether to use HTTPS/WSS for the channel server.
   * When true, valid TLS credentials must be provided via `ssl`.
   */
  secured?: boolean;

  /**
   * TLS credentials used when `secured` is true.
   */
  ssl?: ChannelServerSecureOptions;
}

/**
 * Creates a channel server for syncing storybook instances and sending events.
 * The server provides both WebSocket and REST endpoints:
 * - WebSocket: broadcasts all received messages to all connected clients
 * - POST /send-event: sends an event to all WebSocket clients
 * - POST /select-story-sync/{storyId}: sets the current story and waits for a storyRendered event
 * - GET /index.json: returns the story index built from story files
 * - POST /mcp: MCP endpoint for AI agent integration (when experimental_mcp option is enabled)
 *
 * @param options - Configuration options for the channel server.
 * @param options.port - The port to listen on.
 * @param options.host - The host to bind to.
 * @param options.configPath - The path to the Storybook config folder.
 * @param options.experimental_mcp - Whether to enable MCP server support.
 * @param options.websockets - Whether to enable WebSocket server support.
 * @param options.secured - Whether to use HTTPS/WSS for the channel server.
 * @param options.ssl - TLS credentials used when `secured` is true.
 * @returns The created WebSocketServer instance, or null when websockets are disabled.
 */
export function createChannelServer({
  port = 7007,
  host = undefined,
  configPath,
  experimental_mcp = false,
  websockets = true,
  secured = false,
  ssl,
}: ChannelServerOptions): WebSocketServer | null {
  if (secured && (!ssl?.key || !ssl?.cert)) {
    throw new Error('[Storybook] Secure channel server requires both `ssl.key` and `ssl.cert`.');
  }

  const httpServer = secured ? createHttpsServer(ssl) : createHttpServer();
  const wss = websockets ? new WebSocketServer({ server: httpServer }) : null;
  const mcpServer = experimental_mcp ? createMcpHandler(configPath, wss ?? undefined) : null;
  const selectStorySyncEndpoint = wss ? createSelectStorySyncEndpoint(wss) : null;

  httpServer.on('request', async (req: IncomingMessage, res: ServerResponse) => {
    const protocol = 'encrypted' in req.socket && req.socket.encrypted ? 'https' : 'http';
    const requestUrl = new URL(req.url ?? '/', `${protocol}://${req.headers.host ?? 'localhost'}`);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'GET' && requestUrl.pathname === '/index.json') {
      try {
        const index = await buildIndex({ configPath });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(index));
      } catch (error) {
        console.error('Failed to build index:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to build story index' }));
      }

      return;
    }

    if (req.method === 'POST' && requestUrl.pathname === '/send-event') {
      if (!wss) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'WebSockets are disabled' }));
        return;
      }

      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const json = JSON.parse(body);

          wss.clients.forEach((wsClient) => wsClient.send(JSON.stringify(json)));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } catch (error) {
          console.error('Failed to parse event:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
        }
      });

      return;
    }

    if (req.method === 'POST' && requestUrl.pathname.startsWith(SELECT_STORY_SYNC_ROUTE)) {
      if (!selectStorySyncEndpoint) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'WebSockets are disabled' }));
        return;
      }

      await selectStorySyncEndpoint.handleRequest(requestUrl.pathname, res);
      return;
    }

    // MCP endpoint
    if (
      mcpServer &&
      requestUrl.pathname === '/mcp' &&
      (req.method === 'POST' || req.method === 'GET')
    ) {
      await mcpServer.handleMcpRequest(req, res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  if (wss) {
    wss.on('error', () => {
      // Handled by httpServer 'error' listener — this prevents the WSS
      // from re-throwing and crashing the process.
    });

    // Single global ping interval for all clients
    const pingInterval = setInterval(function ping() {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'ping', args: [] }));
        }
      });
    }, 10000);
    pingInterval.unref?.();

    wss.on('connection', function connection(ws: WebSocket) {
      console.log('WebSocket connection established');

      ws.on('error', console.error);

      ws.on('message', function message(data: Data) {
        try {
          const json = JSON.parse(data.toString());
          selectStorySyncEndpoint?.onSocketMessage(json, ws);

          const msg = JSON.stringify(json);

          wss.clients.forEach((wsClient) => {
            if (wsClient !== ws && wsClient.readyState === WebSocket.OPEN) {
              wsClient.send(msg);
            }
          });
        } catch (error) {
          console.error(error);
        }
      });

      ws.on('close', () => {
        selectStorySyncEndpoint?.onSocketClose(ws);
      });
    });
  }

  httpServer.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(
        `[Storybook] Port ${port} is already in use. The channel server will not start. ` +
          `Another instance may already be running.`
      );
    } else {
      console.error(`[Storybook] Channel server error:`, error);
    }
  });

  httpServer.listen(port, host, () => {
    const protocol = wss ? (secured ? 'WSS' : 'WebSocket') : secured ? 'HTTPS' : 'HTTP';
    console.log(`${protocol} server listening on ${host ?? 'localhost'}:${port}`);
  });

  // Pre-initialize MCP if enabled (non-blocking)
  mcpServer?.preInit();

  return wss;
}
