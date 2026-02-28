import type { Channel } from 'storybook/internal/channels';

/**
 * React Native still pools synthetic events (unlike React DOM 17+).
 * Storybook's serializeArg only recognises web SyntheticBaseEvent, so RN
 * events pass through raw. When anything reads their properties after the
 * current call-stack (render, transport stringify), the event has already
 * been returned to the pool and every getter throws the "reused for
 * performance reasons" warning.
 *
 * Instead of calling persist() (which keeps the event alive and retains
 * references to native views), we snapshot the event into a plain object.
 * This is safe for later access, serialization, and deep-equality checks.
 */
function snapshotValue(value: unknown, depth = 0): unknown {
  if (depth > 3) return '[...]';
  if (value === null || value === undefined) return value;
  if (typeof value === 'function') return undefined;
  if (typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map((item) => snapshotValue(item, depth + 1));
  }

  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    try {
      result[key] = snapshotValue((value as Record<string, unknown>)[key], depth + 1);
    } catch {
      result[key] = '[Error]';
    }
  }
  return result;
}

function isSyntheticEvent(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as any).persist === 'function' &&
    'nativeEvent' in (value as any)
  );
}

function sanitizeActionArgs(value: unknown): unknown {
  if (isSyntheticEvent(value)) {
    return snapshotValue(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeActionArgs);
  }
  return value;
}

/**
 * Patch a Channel so that action-event payloads have their RN synthetic
 * events replaced with plain-object snapshots synchronously, before React
 * recycles them back into the event pool.
 */
export function patchChannelForRN(channel: Channel): void {
  /**
   * Limit WebSocket serialization depth to avoid circular reference errors
   * when action args contain React fiber nodes or other deep object graphs.
   * The default maxDepth of 15 is too deep and causes blocking + crashes.
   */
  globalThis.CHANNEL_OPTIONS = {
    maxDepth: 5,
  };

  const originalEmit = channel.emit.bind(channel);

  channel.emit = (eventName: string, ...args: any[]) => {
    if (eventName === 'storybook/actions/action-event') {
      const actionDisplay = args[0];
      if (actionDisplay?.data?.args != null) {
        actionDisplay.data.args = sanitizeActionArgs(actionDisplay.data.args);
      }
    }
    return originalEmit(eventName, ...args);
  };
}
