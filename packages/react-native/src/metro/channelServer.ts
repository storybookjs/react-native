import { WebSocketServer, WebSocket, Data } from 'ws';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { buffer } from 'node:stream/consumers';
import { buildIndex } from './buildIndex';

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
   * When enabled, adds /mcp and /manifests/components.json endpoints.
   */
  mcp?: boolean;
}

/**
 * Converts a Node.js IncomingMessage to a Web Request object.
 */
async function incomingMessageToWebRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host || 'localhost';
  const protocol = 'encrypted' in req.socket && (req.socket as any).encrypted ? 'https' : 'http';
  const url = new URL(req.url || '/', `${protocol}://${host}`);

  const bodyBuffer = await buffer(req);

  return new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: bodyBuffer.length > 0 ? new Uint8Array(bodyBuffer) : undefined,
  });
}

/**
 * Converts a Web Response to a Node.js ServerResponse.
 */
async function webResponseToServerResponse(
  webResponse: Response,
  nodeResponse: ServerResponse
): Promise<void> {
  nodeResponse.statusCode = webResponse.status;

  webResponse.headers.forEach((value, key) => {
    nodeResponse.setHeader(key, value);
  });

  if (webResponse.body) {
    const reader = webResponse.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        nodeResponse.write(value);
      }
    } finally {
      reader.releaseLock();
    }
  }

  nodeResponse.end();
}

/**
 * Creates a channel server for syncing storybook instances and sending events.
 * The server provides both WebSocket and REST endpoints:
 * - WebSocket: broadcasts all received messages to all connected clients
 * - POST /send-event: sends an event to all WebSocket clients
 * - GET /index.json: returns the story index built from story files
 * - POST /mcp: MCP endpoint for AI agent integration (when mcp option is enabled)
 * - GET /manifests/components.json: component manifest endpoint (when mcp option is enabled)
 *
 * @param options - Configuration options for the channel server.
 * @param options.port - The port to listen on.
 * @param options.host - The host to bind to.
 * @param options.configPath - The path to the Storybook config folder.
 * @param options.mcp - Whether to enable MCP server support.
 * @returns The created WebSocketServer instance.
 */
export function createChannelServer({
  port = 7007,
  host = undefined,
  configPath,
  mcp = false,
}: ChannelServerOptions): WebSocketServer {
  // Lazily initialized MCP handler and manifest cache
  let mcpHandler: ((req: Request) => Promise<Response>) | null = null;
  let mcpInitPromise: Promise<void> | null = null;
  let cachedManifest: string | null = null;
  let manifestBuildPromise: Promise<string> | null = null;

  async function initMcp() {
    if (mcpHandler) return;
    if (mcpInitPromise) {
      await mcpInitPromise;
      return;
    }

    mcpInitPromise = (async () => {
      try {
        const { createStorybookMcpHandler } = await import('@storybook/mcp');
        mcpHandler = await createStorybookMcpHandler({
          manifestProvider: async (_request, manifestPath) => {
            // Only serve component manifests (not docs manifests)
            if (manifestPath.includes('docs.json')) {
              throw new Error('Docs manifest not available in React Native Storybook');
            }
            return getOrBuildManifest();
          },
        });
        console.log('[Storybook] MCP server initialized');
      } catch (error) {
        console.error('[Storybook] Failed to initialize MCP server:', error);
        throw error;
      }
    })();

    await mcpInitPromise;
  }

  async function getOrBuildManifest(): Promise<string> {
    if (cachedManifest) return cachedManifest;
    if (manifestBuildPromise) return manifestBuildPromise;

    manifestBuildPromise = (async () => {
      const { buildManifest } = await import('./manifest/buildManifest.js');
      const manifest = await buildManifest({ configPath });
      cachedManifest = JSON.stringify(manifest);
      return cachedManifest;
    })();

    return manifestBuildPromise;
  }

  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url === '/index.json') {
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

    if (req.method === 'POST' && req.url === '/send-event') {
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

    // MCP endpoints
    if (mcp) {
      if (req.url === '/manifests/components.json' && req.method === 'GET') {
        try {
          const manifestJson = await getOrBuildManifest();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(manifestJson);
        } catch (error) {
          console.error('[Storybook] Failed to build manifest:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to build component manifest' }));
        }
        return;
      }

      if (req.url === '/mcp' && (req.method === 'POST' || req.method === 'GET')) {
        try {
          await initMcp();
          if (!mcpHandler) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'MCP handler not initialized' }));
            return;
          }

          const webRequest = await incomingMessageToWebRequest(req);
          const webResponse = await mcpHandler(webRequest);
          await webResponseToServerResponse(webResponse, res);
        } catch (error) {
          console.error('[Storybook] MCP request failed:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'MCP request failed' }));
        }
        return;
      }
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  const wss = new WebSocketServer({ server: httpServer });

  wss.on('error', () => {
    // Handled by httpServer 'error' listener — this prevents the WSS
    // from re-throwing and crashing the process.
  });

  // Single global ping interval for all clients
  setInterval(function ping() {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'ping', args: [] }));
      }
    });
  }, 10000);

  wss.on('connection', function connection(ws: WebSocket) {
    console.log('WebSocket connection established');

    ws.on('error', console.error);

    ws.on('message', function message(data: Data) {
      try {
        const json = JSON.parse(data.toString());

        wss.clients.forEach((wsClient) => wsClient.send(JSON.stringify(json)));
      } catch (error) {
        console.error(error);
      }
    });
  });

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
    console.log(`WebSocket server listening on ${host ?? 'localhost'}:${port}`);
  });

  // Pre-initialize MCP if enabled (non-blocking)
  if (mcp) {
    initMcp().catch((e) =>
      console.warn('[Storybook] MCP pre-initialization failed (will retry on first request):', e)
    );
  }

  return wss;
}
