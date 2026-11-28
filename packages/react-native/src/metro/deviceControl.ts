import { WebSocket, type WebSocketServer } from 'ws';

/** How long a device command waits for the device to answer, unless the caller asks otherwise. */
export const DEFAULT_DEVICE_TIMEOUT_MS = 5000;
const MAX_DEVICE_TIMEOUT_MS = 60_000;

/**
 * When the requested story is already on screen the device may not render it again, so selecting
 * it resolves after this grace period instead of waiting for a storyRendered event.
 */
const ALREADY_RENDERED_GRACE_MS = 500;

export type DeviceControlErrorCode =
  | 'invalid-input'
  | 'no-device'
  | 'story-not-found'
  | 'render-error'
  | 'timeout';

const STATUS_BY_CODE: Record<DeviceControlErrorCode, number> = {
  'invalid-input': 400,
  'story-not-found': 404,
  timeout: 408,
  'render-error': 422,
  'no-device': 503,
};

export class DeviceControlError extends Error {
  readonly code: DeviceControlErrorCode;
  readonly status: number;

  constructor(code: DeviceControlErrorCode, message: string) {
    super(message);
    this.name = 'DeviceControlError';
    this.code = code;
    this.status = STATUS_BY_CODE[code];
  }
}

export interface DeviceRenderError {
  storyId?: string;
  message: string;
  at: string;
}

export interface DeviceState {
  /** Stable for the lifetime of the connection. */
  id: number;
  connectedAt: string;
  storyId?: string;
  args?: Record<string, unknown>;
  globals?: Record<string, unknown>;
  lastError?: DeviceRenderError;
}

export interface DevicesState {
  /** The story most recently rendered on any connected device. */
  currentStoryId?: string;
  /** Clients that have reported Storybook preview events, i.e. apps running Storybook. */
  devices: DeviceState[];
  /** Every open WebSocket client, including tools that never render stories. */
  connectedClients: number;
}

type Args = Record<string, unknown>;

/** The preview events the device control layer understands, normalized from channel messages. */
type DeviceEvent =
  | { type: 'storyRendered'; storyId: string }
  | { type: 'storyPrepared'; storyId: string; args?: Args }
  | { type: 'storyArgsUpdated'; storyId: string; args: Args }
  | { type: 'globalsUpdated'; globals: Args }
  | { type: 'renderError'; storyId?: string; message: string };

interface DeviceRecord extends DeviceState {
  lastRenderedAt: number;
  reportsPreview: boolean;
}

interface Waiter {
  match: (event: DeviceEvent) => unknown;
  failOnRenderError: boolean;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const DEVICE_EVENT_TYPES = new Set([
  'storyRendered',
  'storyPrepared',
  'storyArgsUpdated',
  'globalsUpdated',
  'storyErrored',
  'storyThrewException',
  'storyMissing',
]);

const DUPLICATE_PREFIX = '_duplicate_';
const DATE_PREFIX = '_date_';

/**
 * The device serializes channel messages with telejson, which writes a repeated reference as
 * `_duplicate_<path from the message root>`, undefined as `_undefined_` and a date as
 * `_date_<ISO string>`. Resolves these so the state reports plain JSON values.
 */
export function decodeChannelMessage(message: unknown): unknown {
  const resolving = new Set<string>();

  const getPath = (path: string[]) =>
    path.reduce<unknown>(
      (value, key) =>
        value !== null && typeof value === 'object'
          ? (value as Record<string, unknown>)[key]
          : undefined,
      message
    );

  const decode = (value: unknown): unknown => {
    if (typeof value === 'string') {
      if (value === '_undefined_') {
        return undefined;
      }

      if (value.startsWith(DATE_PREFIX)) {
        return value.slice(DATE_PREFIX.length);
      }

      if (!value.startsWith(DUPLICATE_PREFIX)) {
        return value;
      }

      const reference = value.slice(DUPLICATE_PREFIX.length);

      // A reference to one of its own ancestors cannot be expanded.
      if (resolving.has(reference)) {
        return undefined;
      }

      let path: string[];

      try {
        const parsed: unknown = JSON.parse(reference);
        path = Array.isArray(parsed) ? parsed.map(String) : reference.split('.');
      } catch {
        path = reference.split('.');
      }

      if (path.length === 0) {
        return undefined;
      }

      resolving.add(reference);
      const resolved = decode(getPath(path));
      resolving.delete(reference);

      return resolved;
    }

    if (Array.isArray(value)) {
      return value.map(decode);
    }

    if (isRecord(value)) {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, decode(item)]));
    }

    return value;
  };

  return decode(message);
}

function parseDeviceEvent(message: unknown): DeviceEvent | null {
  if (
    !isRecord(message) ||
    typeof message.type !== 'string' ||
    !DEVICE_EVENT_TYPES.has(message.type) ||
    !Array.isArray(message.args)
  ) {
    return null;
  }

  const [payload] = (decodeChannelMessage(message) as { args: unknown[] }).args;

  switch (message.type) {
    case 'storyRendered': {
      const storyId =
        typeof payload === 'string' ? payload : isRecord(payload) ? payload.storyId : undefined;
      return typeof storyId === 'string' ? { type: 'storyRendered', storyId } : null;
    }
    case 'storyPrepared':
      return isRecord(payload) && typeof payload.id === 'string'
        ? {
            type: 'storyPrepared',
            storyId: payload.id,
            args: isRecord(payload.args) ? payload.args : undefined,
          }
        : null;
    case 'storyArgsUpdated':
      return isRecord(payload) && typeof payload.storyId === 'string' && isRecord(payload.args)
        ? { type: 'storyArgsUpdated', storyId: payload.storyId, args: payload.args }
        : null;
    case 'globalsUpdated':
      return isRecord(payload) && isRecord(payload.globals)
        ? { type: 'globalsUpdated', globals: payload.globals }
        : null;
    case 'storyErrored': {
      const title = isRecord(payload) && typeof payload.title === 'string' ? payload.title : '';
      const description =
        isRecord(payload) && typeof payload.description === 'string' ? payload.description : '';
      return {
        type: 'renderError',
        message: [title, description].filter(Boolean).join('\n') || 'The story errored',
      };
    }
    case 'storyThrewException': {
      const name = isRecord(payload) && typeof payload.name === 'string' ? payload.name : 'Error';
      const errorMessage =
        isRecord(payload) && typeof payload.message === 'string' ? payload.message : '';
      return { type: 'renderError', message: `${name}: ${errorMessage}` };
    }
    case 'storyMissing': {
      const storyId = typeof payload === 'string' ? payload : undefined;
      return {
        type: 'renderError',
        storyId,
        message: storyId
          ? `Story "${storyId}" is missing on the device`
          : 'The story is missing on the device',
      };
    }
    default:
      return null;
  }
}

function resolveTimeout(timeoutMs: number | undefined, fallback: number): number {
  if (timeoutMs === undefined || !Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return fallback;
  }

  return Math.min(timeoutMs, MAX_DEVICE_TIMEOUT_MS);
}

export interface DeviceControlOptions {
  /**
   * Called when a story fails to render, to replace the device's message with a better one, for
   * example when the story id is not in the index at all.
   */
  explainSelectFailure?: (storyId: string) => Promise<DeviceControlError | undefined>;
}

/**
 * Tracks the state of every device connected to the channel server and sends it commands that
 * resolve once the device answers. The channel server's HTTP endpoints and the MCP tools both use
 * this, so the two transports behave the same.
 */
export function createDeviceControl(wss: WebSocketServer, options: DeviceControlOptions = {}) {
  const devices = new Map<WebSocket, DeviceRecord>();
  const waiters = new Set<Waiter>();
  let nextDeviceId = 1;

  const openDevices = () =>
    [...devices.entries()].filter(([ws]) => ws.readyState === WebSocket.OPEN);

  const getState = (): DevicesState => {
    const open = openDevices().map(([, device]) => device);
    const previews = open.filter((device) => device.reportsPreview);
    const [latest] = [...previews].sort((a, b) => b.lastRenderedAt - a.lastRenderedAt);

    return {
      currentStoryId: latest?.storyId,
      devices: previews.map(
        ({ lastRenderedAt: _lastRenderedAt, reportsPreview: _reportsPreview, ...device }) => device
      ),
      connectedClients: open.length,
    };
  };

  const ensureDevice = () => {
    if (openDevices().length === 0) {
      throw new DeviceControlError(
        'no-device',
        'No device is connected to the Storybook channel server. Open Storybook in your app and make sure websockets are enabled.'
      );
    }
  };

  const resolveStoryId = (storyId: string | undefined) => {
    if (storyId) {
      return storyId;
    }

    const { currentStoryId } = getState();

    if (!currentStoryId) {
      throw new DeviceControlError(
        'invalid-input',
        'No story is rendered on a connected device yet. Pass a storyId or select a story first.'
      );
    }

    return currentStoryId;
  };

  const broadcast = (event: { type: string; args: unknown[] }) => {
    const message = JSON.stringify(event);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  /**
   * Registers a waiter before the command is sent so a fast device cannot answer before anyone is
   * listening. `match` returns the result, or undefined to keep waiting.
   */
  const waitFor = <T>(
    match: (event: DeviceEvent) => T | undefined,
    timeoutMs: number,
    timeoutMessage: string,
    failOnRenderError = true
  ) => {
    let waiter!: Waiter;
    let timer: ReturnType<typeof setTimeout>;

    const promise = new Promise<T>((resolve, reject) => {
      const settle = () => {
        clearTimeout(timer);
        waiters.delete(waiter);
      };

      waiter = {
        match,
        failOnRenderError,
        resolve: (value) => {
          settle();
          resolve(value as T);
        },
        reject: (error) => {
          settle();
          reject(error);
        },
      };

      timer = setTimeout(
        () => waiter.reject(new DeviceControlError('timeout', timeoutMessage)),
        timeoutMs
      );
      waiters.add(waiter);
    });

    const cancel = () => {
      clearTimeout(timer);
      waiters.delete(waiter);
    };

    return { promise, cancel };
  };

  const onSocketConnect = (ws: WebSocket) => {
    devices.set(ws, {
      id: nextDeviceId++,
      connectedAt: new Date().toISOString(),
      lastRenderedAt: 0,
      reportsPreview: false,
    });
  };

  const onSocketClose = (ws: WebSocket) => {
    devices.delete(ws);
  };

  const onSocketMessage = (message: unknown, ws: WebSocket) => {
    const event = parseDeviceEvent(message);

    if (!event) {
      return;
    }

    const device = devices.get(ws);

    if (device) {
      device.reportsPreview = true;

      switch (event.type) {
        case 'storyRendered':
          device.storyId = event.storyId;
          device.lastRenderedAt = Date.now();
          device.lastError = undefined;
          break;
        case 'storyPrepared':
          device.storyId = event.storyId;
          device.args = event.args ?? device.args;
          break;
        case 'storyArgsUpdated':
          if (event.storyId === device.storyId) {
            device.args = event.args;
          }
          break;
        case 'globalsUpdated':
          device.globals = event.globals;
          break;
        case 'renderError':
          device.lastError = {
            storyId: event.storyId ?? device.storyId,
            message: event.message,
            at: new Date().toISOString(),
          };
          break;
      }
    }

    for (const waiter of [...waiters]) {
      if (event.type === 'renderError') {
        if (waiter.failOnRenderError) {
          waiter.reject(new DeviceControlError('render-error', event.message));
        }
        continue;
      }

      const result = waiter.match(event);

      if (result !== undefined) {
        waiter.resolve(result);
      }
    }
  };

  const selectStory = async (
    storyId: string,
    { timeoutMs }: { timeoutMs?: number } = {}
  ): Promise<{ storyId: string }> => {
    ensureDevice();

    const isAlreadyRendered = openDevices().some(([, device]) => device.storyId === storyId);
    const render = waitFor(
      (event) => (event.type === 'storyRendered' && event.storyId === storyId ? true : undefined),
      resolveTimeout(timeoutMs, DEFAULT_DEVICE_TIMEOUT_MS),
      `Story "${storyId}" did not render in time`
    );

    broadcast({ type: 'setCurrentStory', args: [{ viewMode: 'story', storyId }] });

    try {
      if (isAlreadyRendered) {
        const grace = new Promise<void>((resolve) =>
          setTimeout(resolve, ALREADY_RENDERED_GRACE_MS)
        );
        await Promise.race([render.promise, grace]);
        render.cancel();
      } else {
        await render.promise;
      }
    } catch (error) {
      const explained =
        error instanceof DeviceControlError && options.explainSelectFailure
          ? await options.explainSelectFailure(storyId).catch(() => undefined)
          : undefined;

      throw explained ?? error;
    }

    return { storyId };
  };

  const updateArgs = async (
    {
      storyId: requestedStoryId,
      args,
    }: {
      storyId?: string;
      args: Args;
    },
    { timeoutMs }: { timeoutMs?: number } = {}
  ): Promise<{ storyId: string; args: Args }> => {
    if (!isRecord(args)) {
      throw new DeviceControlError('invalid-input', '`args` must be a JSON object.');
    }

    ensureDevice();
    const storyId = resolveStoryId(requestedStoryId);
    const updated = waitFor(
      (event) =>
        event.type === 'storyArgsUpdated' && event.storyId === storyId ? event.args : undefined,
      resolveTimeout(timeoutMs, DEFAULT_DEVICE_TIMEOUT_MS),
      `The device did not confirm the args update for "${storyId}" in time`
    );

    broadcast({ type: 'updateStoryArgs', args: [{ storyId, updatedArgs: args }] });

    return { storyId, args: await updated.promise };
  };

  const resetArgs = async (
    {
      storyId: requestedStoryId,
      argNames,
    }: {
      storyId?: string;
      argNames?: string[];
    },
    { timeoutMs }: { timeoutMs?: number } = {}
  ): Promise<{ storyId: string; args: Args }> => {
    ensureDevice();
    const storyId = resolveStoryId(requestedStoryId);
    const updated = waitFor(
      (event) =>
        event.type === 'storyArgsUpdated' && event.storyId === storyId ? event.args : undefined,
      resolveTimeout(timeoutMs, DEFAULT_DEVICE_TIMEOUT_MS),
      `The device did not confirm the args reset for "${storyId}" in time`
    );

    broadcast({ type: 'resetStoryArgs', args: [{ storyId, argNames }] });

    return { storyId, args: await updated.promise };
  };

  const updateGlobals = async (
    { globals }: { globals: Args },
    { timeoutMs }: { timeoutMs?: number } = {}
  ): Promise<{ globals: Args }> => {
    if (!isRecord(globals)) {
      throw new DeviceControlError('invalid-input', '`globals` must be a JSON object.');
    }

    ensureDevice();
    const updated = waitFor(
      (event) => (event.type === 'globalsUpdated' ? event.globals : undefined),
      resolveTimeout(timeoutMs, DEFAULT_DEVICE_TIMEOUT_MS),
      'The device did not confirm the globals update in time'
    );

    broadcast({ type: 'updateGlobals', args: [{ globals }] });

    return { globals: await updated.promise };
  };

  return {
    getState,
    selectStory,
    updateArgs,
    resetArgs,
    updateGlobals,
    onSocketConnect,
    onSocketMessage,
    onSocketClose,
  };
}

export type DeviceControl = ReturnType<typeof createDeviceControl>;
