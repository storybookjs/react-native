import type { IncomingMessage, ServerResponse } from 'node:http';
import { DeviceControlError, type DeviceControl } from './deviceControl';

export const SELECT_STORY_SYNC_ROUTE = '/select-story-sync/';

/** Kept short for existing select-story-sync callers such as Maestro flows. */
const SELECT_STORY_SYNC_DEFAULT_TIMEOUT_MS = 1000;
const MAX_BODY_BYTES = 1024 * 1024;

const POST_ROUTES = new Set(['/update-args-sync', '/reset-args-sync', '/update-globals-sync']);

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function sendError(res: ServerResponse, error: unknown, extra: Record<string, unknown> = {}) {
  if (error instanceof DeviceControlError) {
    sendJson(res, error.status, {
      success: false,
      ...extra,
      code: error.code,
      error: error.message,
    });
    return;
  }

  sendJson(res, 500, {
    success: false,
    ...extra,
    error: error instanceof Error ? error.message : String(error),
  });
}

async function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  let body = '';

  for await (const chunk of req) {
    body += chunk.toString();

    if (body.length > MAX_BODY_BYTES) {
      throw new DeviceControlError('invalid-input', 'Request body is too large');
    }
  }

  if (!body) {
    return {};
  }

  let json: unknown;

  try {
    json = JSON.parse(body);
  } catch {
    throw new DeviceControlError('invalid-input', 'Invalid JSON');
  }

  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    throw new DeviceControlError('invalid-input', 'Request body must be a JSON object');
  }

  return json as Record<string, unknown>;
}

function parseTimeout(value: unknown): number | undefined {
  const timeout = typeof value === 'string' ? Number(value) : value;
  return typeof timeout === 'number' && Number.isFinite(timeout) ? timeout : undefined;
}

function optionalString(body: Record<string, unknown>, key: string): string | undefined {
  const value = body[key];

  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new DeviceControlError('invalid-input', `\`${key}\` must be a string`);
  }

  return value;
}

function parseStoryIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/select-story-sync\/([^/]+)$/);

  if (!match) {
    return null;
  }

  try {
    return decodeURIComponent(match[1]) || null;
  } catch {
    return null;
  }
}

export function isDeviceControlRoute(method: string | undefined, pathname: string): boolean {
  if (method === 'GET') {
    return pathname === '/state';
  }

  return (
    method === 'POST' && (pathname.startsWith(SELECT_STORY_SYNC_ROUTE) || POST_ROUTES.has(pathname))
  );
}

/**
 * HTTP endpoints that drive connected devices and wait for them to answer:
 * - GET /state: the connected devices with their current story, args and globals
 * - POST /select-story-sync/{storyId}?timeout=ms: selects a story and waits for it to render
 * - POST /update-args-sync { storyId?, args, timeout? }: updates args and returns the new args
 * - POST /reset-args-sync { storyId?, argNames?, timeout? }: resets args and returns the new args
 * - POST /update-globals-sync { globals, timeout? }: updates globals and returns the new globals
 *
 * When `storyId` is omitted the story currently rendered on a device is used.
 */
export async function handleDeviceControlRequest(
  deviceControl: DeviceControl | null,
  req: IncomingMessage,
  res: ServerResponse,
  requestUrl: URL
): Promise<void> {
  const { pathname, searchParams } = requestUrl;

  if (!deviceControl) {
    sendJson(res, 503, { success: false, error: 'WebSockets are disabled' });
    return;
  }

  if (pathname === '/state') {
    sendJson(res, 200, { success: true, ...deviceControl.getState() });
    return;
  }

  if (pathname.startsWith(SELECT_STORY_SYNC_ROUTE)) {
    const storyId = parseStoryIdFromPath(pathname);

    if (!storyId) {
      sendJson(res, 400, { success: false, error: 'Invalid story id' });
      return;
    }

    try {
      await deviceControl.selectStory(storyId, {
        timeoutMs:
          parseTimeout(searchParams.get('timeout')) ?? SELECT_STORY_SYNC_DEFAULT_TIMEOUT_MS,
      });
      sendJson(res, 200, { success: true, storyId });
    } catch (error) {
      sendError(res, error, { storyId });
    }

    return;
  }

  try {
    const body = await readJsonBody(req);
    const timeoutMs = parseTimeout(body.timeout);
    const storyId = optionalString(body, 'storyId');

    switch (pathname) {
      case '/update-args-sync': {
        const result = await deviceControl.updateArgs(
          { storyId, args: body.args as Record<string, unknown> },
          { timeoutMs }
        );
        sendJson(res, 200, { success: true, ...result });
        return;
      }
      case '/reset-args-sync': {
        const { argNames } = body;

        if (
          argNames !== undefined &&
          (!Array.isArray(argNames) || argNames.some((name) => typeof name !== 'string'))
        ) {
          throw new DeviceControlError('invalid-input', '`argNames` must be an array of strings');
        }

        const result = await deviceControl.resetArgs(
          { storyId, argNames: argNames as string[] | undefined },
          { timeoutMs }
        );
        sendJson(res, 200, { success: true, ...result });
        return;
      }
      case '/update-globals-sync': {
        const result = await deviceControl.updateGlobals(
          { globals: body.globals as Record<string, unknown> },
          { timeoutMs }
        );
        sendJson(res, 200, { success: true, ...result });
        return;
      }
    }
  } catch (error) {
    sendError(res, error);
  }
}
