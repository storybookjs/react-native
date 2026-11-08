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

jest.mock('./channelServerRecord', () => ({
  writeChannelServerRecord: jest.fn(() => () => {}),
}));

const { createChannelServer } = require('./channelServer') as typeof import('./channelServer');
const { buildIndex } = require('./buildIndex') as { buildIndex: jest.Mock };

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
  rawBody,
  secured = false,
}: {
  port: number;
  path: string;
  method: 'GET' | 'POST';
  body?: unknown;
  rawBody?: string;
  secured?: boolean;
}): Promise<JsonResponse> {
  return new Promise((resolve, reject) => {
    const requestImpl = secured ? httpsRequestImpl : httpRequestImpl;
    const serializedBody = rawBody ?? (body !== undefined ? JSON.stringify(body) : undefined);
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

type StoryArgs = Record<string, unknown>;

/**
 * Answers channel commands the way the preview on a device does, for the stories it knows. Stories
 * listed in `failing` throw while rendering, unknown stories are reported missing.
 */
async function connectFakeDevice(
  port: number,
  initialArgs: Record<string, StoryArgs>,
  { failing = [] as string[] } = {}
): Promise<WebSocket> {
  const ws = await connectWebSocket(port);
  const args: Record<string, StoryArgs> = JSON.parse(JSON.stringify(initialArgs));
  const emit = (type: string, ...eventArgs: unknown[]) =>
    ws.send(JSON.stringify({ type, args: eventArgs }));

  ws.on('message', (data) => {
    const { type, args: [payload] = [] } = JSON.parse(data.toString()) as {
      type: string;
      args?: Array<Record<string, any>>;
    };

    switch (type) {
      case 'setCurrentStory':
        if (failing.includes(payload.storyId)) {
          emit('storyThrewException', { name: 'TypeError', message: 'boom', stack: '' });
        } else if (!args[payload.storyId]) {
          emit('storyMissing', payload.storyId);
        } else {
          emit('storyPrepared', { id: payload.storyId, args: args[payload.storyId] });
          emit('storyRendered', payload.storyId);
        }
        break;
      case 'updateStoryArgs':
        args[payload.storyId] = { ...args[payload.storyId], ...payload.updatedArgs };
        emit('storyArgsUpdated', { storyId: payload.storyId, args: args[payload.storyId] });
        break;
      case 'resetStoryArgs': {
        const names: string[] = payload.argNames ?? Object.keys(initialArgs[payload.storyId]);
        for (const name of names) {
          args[payload.storyId][name] = initialArgs[payload.storyId][name];
        }
        emit('storyArgsUpdated', { storyId: payload.storyId, args: args[payload.storyId] });
        break;
      }
      case 'updateGlobals':
        emit('globalsUpdated', { globals: { theme: 'light', ...payload.globals } });
        break;
    }
  });

  return ws;
}

describe('channel server device control endpoints', () => {
  let wss: WebSocketServer | null = null;
  let ws: WebSocket | null = null;
  let port = 0;

  const initialArgs = {
    'button--basic': { label: 'Hello', disabled: false },
    'button--other': { label: 'Other' },
  };

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
    buildIndex.mockClear();
  });

  async function selectStory(storyId: string) {
    return channelRequest({
      port,
      method: 'POST',
      path: `/select-story-sync/${storyId}?timeout=2000`,
    });
  }

  test('reports no-device when nothing is connected', async () => {
    const response = await channelRequest({
      port,
      method: 'POST',
      path: '/update-args-sync',
      body: { storyId: 'button--basic', args: { label: 'x' } },
    });

    expect(response.statusCode).toBe(503);
    expect(response.json).toEqual(expect.objectContaining({ success: false, code: 'no-device' }));
  });

  test('tracks the story, args and globals of a connected device', async () => {
    ws = await connectFakeDevice(port, initialArgs);

    expect((await selectStory('button--basic')).statusCode).toBe(200);
    await channelRequest({
      port,
      method: 'POST',
      path: '/update-globals-sync',
      body: { globals: { theme: 'dark' } },
    });

    const response = await channelRequest({ port, method: 'GET', path: '/state' });

    expect(response.statusCode).toBe(200);
    expect(response.json).toEqual({
      success: true,
      currentStoryId: 'button--basic',
      connectedClients: 1,
      devices: [
        expect.objectContaining({
          id: expect.any(Number),
          storyId: 'button--basic',
          args: { label: 'Hello', disabled: false },
          globals: { theme: 'dark' },
        }),
      ],
    });
  });

  test('does not list clients that never report preview events as devices', async () => {
    ws = await connectFakeDevice(port, initialArgs);
    const tool = await connectWebSocket(port);
    await selectStory('button--basic');

    const response = await channelRequest({ port, method: 'GET', path: '/state' });

    expect(response.json).toEqual(
      expect.objectContaining({
        connectedClients: 2,
        devices: [expect.objectContaining({ storyId: 'button--basic' })],
      })
    );

    await closeWebSocket(tool);
  });

  test('updates and resets the args of the current story', async () => {
    ws = await connectFakeDevice(port, initialArgs);
    await selectStory('button--basic');

    const updated = await channelRequest({
      port,
      method: 'POST',
      path: '/update-args-sync',
      body: { args: { label: 'Saved', disabled: true } },
    });

    expect(updated.statusCode).toBe(200);
    expect(updated.json).toEqual({
      success: true,
      storyId: 'button--basic',
      args: { label: 'Saved', disabled: true },
    });

    const reset = await channelRequest({
      port,
      method: 'POST',
      path: '/reset-args-sync',
      body: { argNames: ['label'] },
    });

    expect(reset.json).toEqual({
      success: true,
      storyId: 'button--basic',
      args: { label: 'Hello', disabled: true },
    });
  });

  test('updates the args of a story passed by id', async () => {
    ws = await connectFakeDevice(port, initialArgs);
    await selectStory('button--basic');

    const response = await channelRequest({
      port,
      method: 'POST',
      path: '/update-args-sync',
      body: { storyId: 'button--other', args: { label: 'Changed' } },
    });

    expect(response.json).toEqual({
      success: true,
      storyId: 'button--other',
      args: { label: 'Changed' },
    });
  });

  test('asks for a story id when no story has rendered yet', async () => {
    ws = await connectFakeDevice(port, initialArgs);

    const response = await channelRequest({
      port,
      method: 'POST',
      path: '/update-args-sync',
      body: { args: { label: 'x' } },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json).toEqual(expect.objectContaining({ code: 'invalid-input' }));
  });

  test('rejects invalid bodies', async () => {
    ws = await connectFakeDevice(port, initialArgs);

    const invalidJson = await channelRequest({
      port,
      method: 'POST',
      path: '/update-args-sync',
      rawBody: '{nope',
    });
    const invalidArgs = await channelRequest({
      port,
      method: 'POST',
      path: '/update-args-sync',
      body: { storyId: 'button--basic', args: ['label'] },
    });

    expect(invalidJson.statusCode).toBe(400);
    expect(invalidJson.json.error).toBe('Invalid JSON');
    expect(invalidArgs.statusCode).toBe(400);
    expect(invalidArgs.json.error).toBe('`args` must be a JSON object.');
  });

  test('fails a selection as soon as the story throws', async () => {
    ws = await connectFakeDevice(port, initialArgs, { failing: ['button--broken'] });

    const start = Date.now();
    const response = await selectStory('button--broken');

    expect(response.statusCode).toBe(422);
    expect(response.json).toEqual(
      expect.objectContaining({
        success: false,
        storyId: 'button--broken',
        code: 'render-error',
        error: 'TypeError: boom',
      })
    );
    expect(Date.now() - start).toBeLessThan(1000);

    const state = await channelRequest({ port, method: 'GET', path: '/state' });
    expect(state.json.devices).toEqual([
      expect.objectContaining({
        lastError: expect.objectContaining({ message: 'TypeError: boom' }),
      }),
    ]);
  });

  test('suggests stories of the same component when a story id is not in the index', async () => {
    buildIndex.mockResolvedValue({
      v: 5,
      entries: { 'button--basic': {}, 'button--other': {}, 'card--basic': {} },
    });
    ws = await connectFakeDevice(port, initialArgs);

    const response = await selectStory('button--typo');

    expect(response.statusCode).toBe(404);
    expect(response.json).toEqual(
      expect.objectContaining({
        code: 'story-not-found',
        error:
          'Story "button--typo" not found. Stories of the same component: button--basic, button--other',
      })
    );

    buildIndex.mockResolvedValue({ entries: {} });
  });
});

describe('decodeChannelMessage', () => {
  const { decodeChannelMessage } = require('./deviceControl') as typeof import('./deviceControl');

  test('resolves telejson duplicate references and undefined markers', () => {
    expect(
      decodeChannelMessage({
        type: 'globalsUpdated',
        args: [
          {
            userGlobals: { backgrounds: { value: 'dark' }, viewport: undefined },
            globals: {
              backgrounds: '_duplicate_["args","0","userGlobals","backgrounds"]',
              viewport: '_undefined_',
              legacy: '_duplicate_args.0.userGlobals.backgrounds',
              birthday: '_date_2017-01-20T00:00:00.000Z',
            },
          },
        ],
      })
    ).toEqual({
      type: 'globalsUpdated',
      args: [
        {
          userGlobals: { backgrounds: { value: 'dark' } },
          globals: {
            backgrounds: { value: 'dark' },
            viewport: undefined,
            legacy: { value: 'dark' },
            birthday: '2017-01-20T00:00:00.000Z',
          },
        },
      ],
    });
  });

  test('does not expand a reference to the root', () => {
    expect(decodeChannelMessage({ self: '_duplicate_[]' })).toEqual({ self: undefined });
  });
});
