import { WebSocketServer, WebSocket, Data } from 'ws';
import { createServer as createHttpServer, IncomingMessage, ServerResponse } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { buildIndex } from './buildIndex';
import { writeChannelServerRecord } from './channelServerRecord';
import { createDeviceControl, DeviceControlError } from './deviceControl';
import { handleDeviceControlRequest, isDeviceControlRoute } from './deviceControlEndpoints';
import { createMcpHandler } from './mcpServer';

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

  /**
   * Whether the channel server should keep the Node.js process alive.
   * When false, the server is unref'd.
   * Defaults to false.
   */
  keepNodeProcessAlive?: boolean;
}

/**
 * Creates a channel server for syncing storybook instances and sending events.
 * The server provides both WebSocket and REST endpoints:
 * - WebSocket: broadcasts all received messages to all connected clients
 * - POST /send-event: sends an event to all WebSocket clients
 * - POST /select-story-sync/{storyId}: sets the current story and waits for a storyRendered event
 * - GET /state, POST /update-args-sync, /reset-args-sync, /update-globals-sync: device control
 *   endpoints that wait for the device to answer (see deviceControlEndpoints.ts)
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
 * @param options.keepAlive - Whether the channel server should keep the Node.js process alive.
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
  keepNodeProcessAlive = false,
}: ChannelServerOptions): WebSocketServer | null {
  if (secured && (!ssl?.key || !ssl?.cert)) {
    throw new Error('[Storybook] Secure channel server requires both `ssl.key` and `ssl.cert`.');
  }

  const httpServer = secured ? createHttpsServer(ssl) : createHttpServer();
  const wss = websockets ? new WebSocketServer({ server: httpServer }) : null;
  const deviceControl = wss
    ? createDeviceControl(wss, {
        explainSelectFailure: (storyId) => explainMissingStory(configPath, storyId),
      })
    : null;
  const mcpServer = experimental_mcp
    ? createMcpHandler(configPath, deviceControl ?? undefined)
    : null;

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

    if (isDeviceControlRoute(req.method, requestUrl.pathname)) {
      await handleDeviceControlRequest(deviceControl, req, res, requestUrl);
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
    }, 10000) as { unref?: () => void };
    // node timeers have unref
    pingInterval.unref?.();

    wss.on('connection', function connection(ws: WebSocket) {
      console.log('WebSocket connection established');
      deviceControl?.onSocketConnect(ws);

      ws.on('error', console.error);

      ws.on('message', function message(data: Data) {
        try {
          const json = JSON.parse(data.toString());
          deviceControl?.onSocketMessage(json, ws);

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
        deviceControl?.onSocketClose(ws);
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

    const urlHost = !host || host === '0.0.0.0' || host === '::' ? 'localhost' : host;
    const removeRecord = writeChannelServerRecord({
      url: `${secured ? 'https' : 'http'}://${urlHost.includes(':') ? `[${urlHost}]` : urlHost}:${port}`,
      port,
      host,
      secured,
      websockets: Boolean(wss),
      mcp: experimental_mcp,
      configPath,
    });
    httpServer.once('close', removeRecord);
  });

  // by default keepNodeProcessAlive is false to make sure we don't cause bundling to hang
  if (!keepNodeProcessAlive) {
    httpServer.unref();
  }

  const closeOnExit = () => httpServer.close();
  process.once('beforeExit', closeOnExit);
  httpServer.once('close', () => process.off('beforeExit', closeOnExit));

  // Pre-initialize MCP if enabled (non-blocking)
  mcpServer?.preInit();

  return wss;
}

const MAX_SUGGESTED_STORY_IDS = 10;

/**
 * Turns a failed selection into a not-found error when the story id is not in the index, with the
 * closest ids so an agent can correct itself.
 */
async function explainMissingStory(
  configPath: string,
  storyId: string
): Promise<DeviceControlError | undefined> {
  const index = await buildIndex({ configPath });
  const ids = Object.keys(index.entries);

  // An empty index says more about the project setup than about this story id.
  if (ids.length === 0 || ids.includes(storyId)) {
    return undefined;
  }

  const [componentPart] = storyId.split('--');
  const related = ids.filter((id) => id.startsWith(`${componentPart}--`));
  const suggestions = (related.length > 0 ? related : ids).slice(0, MAX_SUGGESTED_STORY_IDS);

  return new DeviceControlError(
    'story-not-found',
    `Story "${storyId}" not found. ` +
      `${related.length > 0 ? 'Stories of the same component' : 'Available stories include'}: ${suggestions.join(', ')}`
  );
}
