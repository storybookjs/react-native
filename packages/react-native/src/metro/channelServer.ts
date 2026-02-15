import { WebSocketServer, WebSocket, Data } from 'ws';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
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
}

/**
 * Creates a channel server for syncing storybook instances and sending events.
 * The server provides both WebSocket and REST endpoints:
 * - WebSocket: broadcasts all received messages to all connected clients
 * - POST /send-event: sends an event to all WebSocket clients
 * - GET /index.json: returns the story index built from story files
 *
 * @param options - Configuration options for the channel server.
 * @param options.port - The port to listen on.
 * @param options.host - The host to bind to.
 * @param options.configPath - The path to the Storybook config folder.
 * @returns The created WebSocketServer instance.
 */
export function createChannelServer({
  port = 7007,
  host = undefined,
  configPath,
}: ChannelServerOptions): WebSocketServer {
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

  return wss;
}
