/**
 * Minimal HTTP + WebSocket server for manual connectivity checks (LAN, firewall).
 * Do not bind the same port as Metro's Storybook channel server while Metro is using it.
 *
 * Sends Storybook-style heartbeats every 10s (`{ type: 'ping', args: [] }`), matching
 * packages/react-native/src/metro/channelServer.ts so storybook's WebsocketTransport
 * does not close the socket (~20s) waiting for pings.
 *
 * Env: STORYBOOK_WS_HOST (bind address; omit for all interfaces), STORYBOOK_WS_PORT (default 7007)
 */
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';

const PING_INTERVAL_MS = 10_000;

const port = Number(process.env.STORYBOOK_WS_PORT) || 7007;
const host = process.env.STORYBOOK_WS_HOST || undefined;

const httpServer = createServer((_req, res) => {
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server: httpServer });

// Same global ping interval as createChannelServer — keeps Storybook client transport alive.
const pingInterval = setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'ping', args: [] }));
    }
  });
}, PING_INTERVAL_MS);
pingInterval.unref?.();

wss.on('connection', (ws) => {
  console.log('[ws-smoke-server] WebSocket connection established');

  ws.on('message', (data) => {
    const text = data.toString();
    console.log('[ws-smoke-server] message:', text);
    try {
      const json = JSON.parse(text);
      if (json?.type === 'pong') {
        console.log('[ws-smoke-server] saw Storybook transport pong (heartbeat ack)');
      }
    } catch {
      // ignore non-JSON
    }
  });
});

httpServer.listen(port, host, () => {
  const where = host ?? '0.0.0.0 (all interfaces)';
  console.log(`[ws-smoke-server] listening on ${where}:${port}`);
});
