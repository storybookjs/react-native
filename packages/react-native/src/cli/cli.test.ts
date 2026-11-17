/** @jest-environment node */

import { mkdtempSync, rmSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { readChannelServerRecord, writeChannelServerRecord } from '../metro/channelServerRecord';
import { createChannelClient, resolveChannelEndpoint } from './channelClient';
import { rewriteToolNames } from './docs';
import { getSkill, SKILL_IDS } from './skills';

// The story index needs the ESM storybook build, which jest does not load; nothing here indexes.
jest.mock('../metro/buildIndex', () => ({ buildIndex: jest.fn() }));

describe('rewriteToolNames', () => {
  test('points the docs tools at the CLI', () => {
    expect(
      rewriteToolNames(
        'Use the docs-list tool to see entries. Then call docs-show, or `docs-show-story` with `withStoryIds: true`.'
      )
    ).toBe(
      'Use `npx sb-rn docs list` to see entries. Then call `npx sb-rn docs show`, or `npx sb-rn docs show-story` with `--withStoryIds`.'
    );
  });

  test('leaves ids that only contain a tool name alone', () => {
    expect(rewriteToolNames('Story ID: docs-list-item--basic')).toBe(
      'Story ID: docs-list-item--basic'
    );
  });
});

describe('resolveChannelEndpoint', () => {
  let cwd: string;
  const env = { ...process.env };

  beforeEach(() => {
    cwd = mkdtempSync(path.join(tmpdir(), 'sb-rn-'));
    delete process.env.STORYBOOK_WS_HOST;
    delete process.env.STORYBOOK_WS_PORT;
    delete process.env.STORYBOOK_WS_SECURED;
  });

  afterEach(() => {
    process.env = { ...env };
    jest.restoreAllMocks();
    rmSync(cwd, { recursive: true, force: true });
  });

  function writeRecord(port: number) {
    jest.spyOn(process, 'cwd').mockReturnValue(cwd);
    const remove = writeChannelServerRecord({
      url: `http://localhost:${port}`,
      port,
      secured: false,
      websockets: true,
      mcp: false,
      configPath: './.rnstorybook',
    });
    jest.mocked(process.cwd).mockRestore();
    return remove;
  }

  test('defaults to localhost:7007', () => {
    expect(resolveChannelEndpoint({ cwd })).toEqual({
      url: 'http://localhost:7007',
      source: 'default',
    });
  });

  test('uses the record of a server running in the project', () => {
    const remove = writeRecord(7100);

    expect(readChannelServerRecord(cwd)).toEqual(
      expect.objectContaining({ pid: process.pid, port: 7100, cwd })
    );
    expect(resolveChannelEndpoint({ cwd })).toEqual({
      url: 'http://localhost:7100',
      source: 'record',
    });

    remove();
    expect(readChannelServerRecord(cwd)).toBeUndefined();
  });

  test('prefers the bundler environment variables over the record', () => {
    writeRecord(7100);
    process.env.STORYBOOK_WS_HOST = '192.168.1.5';
    process.env.STORYBOOK_WS_PORT = '7200';

    expect(resolveChannelEndpoint({ cwd })).toEqual({
      url: 'http://192.168.1.5:7200',
      source: 'env',
    });
  });

  test('prefers flags over everything else', () => {
    process.env.STORYBOOK_WS_PORT = '7200';

    expect(resolveChannelEndpoint({ cwd, port: 7300 })).toEqual({
      url: 'http://localhost:7300',
      source: 'flag',
    });
    expect(resolveChannelEndpoint({ cwd, url: 'https://example.test:9000/' })).toEqual({
      url: 'https://example.test:9000',
      source: 'flag',
    });
  });
});

describe('createChannelClient', () => {
  let server: Server | null = null;

  afterEach(async () => {
    await new Promise((resolve) => (server ? server.close(resolve) : resolve(undefined)));
    server = null;
  });

  async function startServer(statusCode: number, body: unknown) {
    server = createServer((_req, res) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    });
    await new Promise<void>((resolve) => server!.listen(0, '127.0.0.1', resolve));
    const { port } = server.address() as AddressInfo;
    return createChannelClient({ url: `http://127.0.0.1:${port}`, source: 'flag' }, 1000);
  }

  test('returns the response of a successful command', async () => {
    const client = await startServer(200, { success: true, storyId: 'a--b', args: { x: 1 } });

    await expect(client.updateArgs({ args: { x: 1 } })).resolves.toEqual(
      expect.objectContaining({ storyId: 'a--b', args: { x: 1 } })
    );
  });

  test('throws the error and code the server reports', async () => {
    const client = await startServer(503, {
      success: false,
      code: 'no-device',
      error: 'No device is connected',
    });

    await expect(client.selectStory('a--b')).rejects.toMatchObject({
      message: 'No device is connected',
      code: 'no-device',
    });
  });

  test('explains a server that predates the command', async () => {
    const client = await startServer(404, { error: 'Not found' });

    await expect(client.getState()).rejects.toThrow('does not support /state');
  });

  test('explains an unreachable server', async () => {
    const client = createChannelClient({ url: 'http://127.0.0.1:1', source: 'default' }, 1000);

    await expect(client.getState()).rejects.toMatchObject({ code: 'unreachable' });
  });
});

describe('skills', () => {
  test.each(SKILL_IDS)('%s only refers to commands the CLI has', (id) => {
    const commands = [...getSkill(id).matchAll(/npx sb-rn ([a-z-]+(?: [a-z-]+)?)/g)].map(
      ([, command]) => command
    );
    const known = [
      'docs list',
      'docs show',
      'docs show-story',
      'stories list',
      'stories select',
      'args update',
      'args reset',
      'globals update',
      'status',
      'skills ui-workflow',
      'skills write-story',
    ];

    for (const command of commands) {
      expect(known).toContain(command);
    }
  });
});
