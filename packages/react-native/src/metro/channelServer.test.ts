/** @jest-environment node */

import { request, createServer, type Server } from 'node:http';
import { setTimeout as delay } from 'node:timers/promises';
import { WebSocket, type WebSocketServer } from 'ws';

jest.mock('./buildIndex', () => ({
  buildIndex: jest.fn(async () => ({ entries: {} })),
}));

const { createChannelServer } = require('./channelServer') as typeof import('./channelServer');

interface JsonResponse {
  statusCode: number;
  json: Record<string, unknown>;
}

async function getFreePort(): Promise<number> {
  const server = createServer();

  return new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Failed to resolve a free port')));
        return;
      }

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(address.port);
      });
    });
  });
}

async function httpRequest({
  port,
  path,
  method,
}: {
  port: number;
  path: string;
  method: 'GET' | 'POST';
}): Promise<JsonResponse> {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        host: '127.0.0.1',
        port,
        path,
        method,
      },
      (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk.toString();
        });

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode ?? 0,
            json: body ? JSON.parse(body) : {},
          });
        });
      }
    );

    req.on('error', reject);
    req.end();
  });
}

async function waitForServer(port: number): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < 3000) {
    try {
      await httpRequest({ port, path: '/', method: 'GET' });
      return;
    } catch {
      await delay(20);
    }
  }

  throw new Error('Channel server did not become ready in time');
}

async function connectWebSocket(port: number): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}`);

    ws.once('open', () => resolve(ws));
    ws.once('error', reject);
  });
}

async function closeWebSocket(ws: WebSocket): Promise<void> {
  if (ws.readyState === WebSocket.CLOSED) {
    return;
  }

  await new Promise<void>((resolve) => {
    ws.once('close', () => resolve());
    ws.close();
  });
}

async function closeChannelServer(wss: WebSocketServer | null): Promise<void> {
  if (!wss) {
    return;
  }

  const server = wss.options.server as Server | undefined;

  await new Promise<void>((resolve, reject) => {
    wss.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      if (!server) {
        resolve();
        return;
      }

      server.close((serverError) => {
        if (serverError) {
          reject(serverError);
          return;
        }
        resolve();
      });
    });
  });
}

describe('channel server select-story-sync endpoint', () => {
  let wss: WebSocketServer | null = null;
  let ws: WebSocket | null = null;
  let port = 0;

  beforeEach(async () => {
    port = await getFreePort();
    wss = createChannelServer({
      port,
      host: '127.0.0.1',
      configPath: process.cwd(),
      websockets: true,
    });
    await waitForServer(port);
  });

  afterEach(async () => {
    if (ws) {
      await closeWebSocket(ws);
      ws = null;
    }

    await closeChannelServer(wss);
    wss = null;
  });

  test('returns success after matching storyRendered event', async () => {
    const storyId = 'button--basic';
    ws = await connectWebSocket(port);

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString()) as { type?: string; args?: unknown[] };
      const firstArg = message.args?.[0] as { storyId?: string } | undefined;

      if (message.type === 'setCurrentStory' && firstArg?.storyId === storyId) {
        ws?.send(JSON.stringify({ type: 'storyRendered', args: [storyId] }));
      }
    });

    const response = await httpRequest({
      port,
      method: 'POST',
      path: `/select-story-sync/${storyId}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json).toEqual({ success: true, storyId });
  });

  test('returns success after 500ms when selecting the last rendered story', async () => {
    const storyId = 'button--already-rendered';
    ws = await connectWebSocket(port);

    ws.send(JSON.stringify({ type: 'storyRendered', args: [storyId] }));
    await delay(20);

    const start = Date.now();
    const response = await httpRequest({
      port,
      method: 'POST',
      path: `/select-story-sync/${storyId}`,
    });
    const duration = Date.now() - start;

    expect(response.statusCode).toBe(200);
    expect(response.json).toEqual({ success: true, storyId });
    expect(duration).toBeGreaterThanOrEqual(450);
    expect(duration).toBeLessThan(950);
  });

  test('returns error when story is not rendered within 1000ms', async () => {
    const storyId = 'button--timeout';
    ws = await connectWebSocket(port);

    const start = Date.now();
    const response = await httpRequest({
      port,
      method: 'POST',
      path: `/select-story-sync/${storyId}`,
    });
    const duration = Date.now() - start;

    expect(response.statusCode).toBe(408);
    expect(response.json).toEqual(
      expect.objectContaining({
        success: false,
        storyId,
        error: `Story "${storyId}" did not render in time`,
      })
    );
    expect(duration).toBeGreaterThanOrEqual(950);
  });
});
