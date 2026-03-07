/** @jest-environment node */

import { request as httpRequestImpl, createServer, type Server as HttpServer } from 'node:http';
import { request as httpsRequestImpl, type Server as HttpsServer } from 'node:https';
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

const TEST_TLS_KEY = `-----BEGIN PRIVATE KEY-----
MIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCVX4VTCyA8SMum
NK1NCrDhI0aXAO7S/WBIrIpY1YyMteYG82rtQD9wpE8W7rCOJ3ViIW0sAMc9SAlG
qC0SevwfeOPJcprcbTOW2roIg4s9uU6pkoWLDg9bVnmk9U6DueQRDfDdPmh7t+Ti
F6kK3XUMyo16lEgEiHyJ+tzrPszPmvbKqWfeAzZ5rVBCaLzZ9ccwBr7LwmHlXqkS
iq6x3ZkWXuE2Im0wkqWIRAHqJ6misfshxRQ2wuhll89E/rr2E9pj1KFAFxdQnZgc
u/4IIGm3jkUoLFJoSX3twGL5aAiR9h0peyQV8h0eoLSnA4Vr3Gtlsayhc7jkqzTp
3VBK0pslAgMBAAECgf9AKqTpjqw1AIJCXKXATyWedNceFU+fKLkst9V9mumFpSxd
M5eJmpb7YdLtKo3YSkW390B1u/xMlvOeCj0Zj60iZiiQhKO6qYPOGDX88kxXPq4T
G/OJM0862A6UHHd6ZdlTJNu+Lu1sOChaojLmcNgln2vDw6fzZwOnCWsko06C36bM
tzuTA2pJOOdCOUt2klGipryD9BTBK/NGnHwhXCTNrnn2Wx0hHISLT0AfTTyX5vtK
TEXXMN7F3u2v56ifU5RRCpeKDsqoMZLWhHTy6Aoisk+wDUkqQWZ9zrrlIuB9n0do
uFD8UqlEi7wwbr8utwU9C+973kVxPVk/YAfXRoECgYEAyL3bp1qbG7G9nXvXRLFF
V3fFZdtp49qy8UJ3mkpYO4FFmLjxVrXmG5yERIn8FsOsjKZq6tYRZI0lJxQ1B7OV
0EZ6aRg8Xkr1q4jIzeJ/VGm5Ayiavg5cHPjmMqPA/+jhAd0XSuZkZ5X9fcAlYNp2
RExmxCT9A/Ot9VloitkdvYECgYEAvn3BU3ac1FAelzV+Ar+qJ3ZeWzOrnjZPztNb
vFpurXLYnZLbKvJsLiAjzGghr3APR5/A1Ccp0H2NimAe9h9JIN3EOHw2zuU6wPx9
6jIarRlsf6H/LhEmc/l6CXQIK7xKFZmZk2N6GQhhxN8bEyoXod9kf2chFNMW9BFj
5LDQ96UCgYBoc8n4ob+1wF2OtWLE3ozbP3oaTvohUqnruY8sXGTeyZwiJJGHcezD
D0UPuNDQM470PJ/DhBHWxU7Ar9YMJNjeX93QE4lN8ykz0V/TKXjhvoVDbHxgSm6J
sMVvMh/5yP5TjuxQz+MMt1IIfdO1OtdxIGQUyb5RsRkiYhxwqxq7gQKBgB4q9lIM
h9vL8HxL+W/gAMeNJHZXIYfF3C/KI04aGEsZ1BpoZpNPnzhS2LiHiUYqfhD+yOAQ
b7vYFnFitaSO4dr1pBy590ge34YutpY/ZyAg1aEE+8/E4Y0eZmhW2vBqOmVfVQYV
jAGo5SrzlmsbkHCPW3Ad2gxdPdZbZrGSGxYNAoGBAIwskI6GQGtqSxXJcgCEmGhw
0lY5FaWkt+t9anoZ1W3w4pRDR3yb4RPj1cVy1otvwzme8Z/H1IvHBGaRm1PpaFHK
HwPZlSPU+siOLQepoBKUzxLpVhz1Q+eo05flVJaBFMcnChfFK0INepg8yxnL9YJr
uhQbkM1eNKk4nlN8lltb
-----END PRIVATE KEY-----`;

const TEST_TLS_CERT = `-----BEGIN CERTIFICATE-----
MIIC8zCCAdugAwIBAgIUcFnbCRvwnAb209JtLjHwyNyL/08wDQYJKoZIhvcNAQEL
BQAwFDESMBAGA1UEAwwJbG9jYWxob3N0MB4XDTI2MDMwNzEzMDkzNVoXDTM2MDMw
NDEzMDkzNVowFDESMBAGA1UEAwwJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEAlV+FUwsgPEjLpjStTQqw4SNGlwDu0v1gSKyKWNWMjLXm
BvNq7UA/cKRPFu6wjid1YiFtLADHPUgJRqgtEnr8H3jjyXKa3G0zltq6CIOLPblO
qZKFiw4PW1Z5pPVOg7nkEQ3w3T5oe7fk4hepCt11DMqNepRIBIh8ifrc6z7Mz5r2
yqln3gM2ea1QQmi82fXHMAa+y8Jh5V6pEoqusd2ZFl7hNiJtMJKliEQB6ieporH7
IcUUNsLoZZfPRP669hPaY9ShQBcXUJ2YHLv+CCBpt45FKCxSaEl97cBi+WgIkfYd
KXskFfIdHqC0pwOFa9xrZbGsoXO45Ks06d1QStKbJQIDAQABoz0wOzAaBgNVHREE
EzARgglsb2NhbGhvc3SHBH8AAAEwHQYDVR0OBBYEFDSjrJMxP2eyPtNYrifn3+yh
XsFvMA0GCSqGSIb3DQEBCwUAA4IBAQB3sHTBFH4zWSFklEOGzFLO/B/lSnTQs6WR
9kw7mBoVKWJSE6ce54BrfJbX3pEZ/7tepaSDnyKPW0RIzCl7+z/TIpeVwmQ+fHbo
aeUGpwfdJXJUbz6Nmf5XgrvOLwS6TE1eUb27DDNEmVe3dqjYMuNpVPQP12tX9KEe
ZQ1FYMXMyxt3Oy2t0WH5o7pMl5I1aw0N5VFrzhc8vVPT/T9X67RaLJKyvxzCbhRR
ITiQ7rr39w7yC184S0XjN0ORe4S+R7Y0EMB7uDmpPd207XwfUStzlEYQpzQa0pV6
gnqWMMckqFKDk33Qp/lEDTDHqtB7P8KTi0e+jFYU1a7eQKtoCQ2C
-----END CERTIFICATE-----`;

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
  secured = false,
}: {
  port: number;
  path: string;
  method: 'GET' | 'POST';
  secured?: boolean;
}): Promise<JsonResponse> {
  return new Promise((resolve, reject) => {
    const requestImpl = secured ? httpsRequestImpl : httpRequestImpl;
    const req = requestImpl(
      {
        host: '127.0.0.1',
        port,
        path,
        method,
        ...(secured ? { rejectUnauthorized: false } : {}),
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

    const sendResponse = await channelRequestWithBody({
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

async function channelRequestWithBody({
  port,
  path,
  method,
  body,
  secured = false,
}: {
  port: number;
  path: string;
  method: 'POST';
  body: unknown;
  secured?: boolean;
}): Promise<JsonResponse> {
  return new Promise((resolve, reject) => {
    const requestImpl = secured ? httpsRequestImpl : httpRequestImpl;
    const serializedBody = JSON.stringify(body);
    const req = requestImpl(
      {
        host: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(serializedBody),
        },
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
    req.write(serializedBody);
    req.end();
  });
}
