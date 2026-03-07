/** @jest-environment node */

import { readFileSync } from 'node:fs';
import { request as httpRequestImpl, createServer, type Server as HttpServer } from 'node:http';
import { request as httpsRequestImpl, type Server as HttpsServer } from 'node:https';
import * as path from 'node:path';
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

const TEST_TLS_KEY = readFileSync(path.join(__dirname, '__fixtures__/test-tls-key.pem'));
const TEST_TLS_CERT = readFileSync(path.join(__dirname, '__fixtures__/test-tls-cert.pem'));

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

async function channelRequest({
  port,
  path,
  method,
  body,
  secured = false,
}: {
  port: number;
  path: string;
  method: 'GET' | 'POST';
  body?: unknown;
  secured?: boolean;
}): Promise<JsonResponse> {
  return new Promise((resolve, reject) => {
    const requestImpl = secured ? httpsRequestImpl : httpRequestImpl;
    const serializedBody = body !== undefined ? JSON.stringify(body) : undefined;
    const req = requestImpl(
      {
        host: '127.0.0.1',
        port,
        path,
        method,
        ...(serializedBody
          ? {
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(serializedBody),
              },
            }
          : {}),
        ...(secured ? { rejectUnauthorized: false } : {}),
      },
      (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
          responseBody += chunk.toString();
        });

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode ?? 0,
            json: responseBody ? JSON.parse(responseBody) : {},
          });
        });
      }
    );

    req.on('error', reject);

    if (serializedBody) {
      req.write(serializedBody);
    }

    req.end();
  });
}

async function waitForServer(port: number): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < 3000) {
    try {
      await channelRequest({ port, path: '/', method: 'GET' });
      return;
    } catch {
      await delay(20);
    }
  }

  throw new Error('Channel server did not become ready in time');
}

async function connectWebSocket(port: number, secured = false): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`${secured ? 'wss' : 'ws'}://127.0.0.1:${port}`, {
      ...(secured ? { rejectUnauthorized: false } : {}),
    });

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

  const server = wss.options.server as HttpServer | HttpsServer | undefined;

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

    const response = await channelRequest({
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
    const response = await channelRequest({
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
    const response = await channelRequest({
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

  test('does not reuse a disconnected client render for the 500ms fast path', async () => {
    const storyId = 'button--stale-render';
    ws = await connectWebSocket(port);

    ws.send(JSON.stringify({ type: 'storyRendered', args: [storyId] }));
    await delay(20);

    await closeWebSocket(ws);
    ws = await connectWebSocket(port);

    const start = Date.now();
    const response = await channelRequest({
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

describe('secure channel server', () => {
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
      secured: true,
      ssl: {
        key: TEST_TLS_KEY,
        cert: TEST_TLS_CERT,
      },
    });

    const start = Date.now();
    while (Date.now() - start < 3000) {
      try {
        await channelRequest({ port, path: '/', method: 'GET', secured: true });
        return;
      } catch {
        await delay(20);
      }
    }

    throw new Error('Secure channel server did not become ready in time');
  });

  afterEach(async () => {
    if (ws) {
      await closeWebSocket(ws);
      ws = null;
    }

    await closeChannelServer(wss);
    wss = null;
  });

  test('serves index.json over https and accepts wss connections', async () => {
    const indexResponse = await channelRequest({
      port,
      method: 'GET',
      path: '/index.json',
      secured: true,
    });

    expect(indexResponse.statusCode).toBe(200);
    expect(indexResponse.json).toEqual({ entries: {} });

    ws = await connectWebSocket(port, true);

    const receivedMessage = new Promise<Record<string, unknown>>((resolve) => {
      ws?.once('message', (data) => resolve(JSON.parse(data.toString())));
    });

    const payload = {
      type: 'secure-test-event',
      args: [{ value: 'hello' }],
      from: 'secure-test-client',
    };

    const sendResponse = await channelRequest({
      port,
      method: 'POST',
      path: '/send-event',
      body: payload,
      secured: true,
    });

    expect(sendResponse.statusCode).toBe(200);
    await expect(receivedMessage).resolves.toEqual(payload);
  });

  test('throws when secure mode is enabled without key and cert', () => {
    expect(() =>
      createChannelServer({
        port,
        host: '127.0.0.1',
        configPath: process.cwd(),
        websockets: true,
        secured: true,
      })
    ).toThrow('[Storybook] Secure channel server requires both `ssl.key` and `ssl.cert`.');
  });
});
