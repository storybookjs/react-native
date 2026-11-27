import type { Call, CallRef } from 'storybook/internal/instrumenter';

const MAX_LENGTH = 60;

const truncate = (text: string) =>
  text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH - 1)}…` : text;

const isCallRef = (value: unknown): value is CallRef =>
  typeof value === 'object' && value !== null && '__callId__' in value;

// The instrumenter serializes values it can't send as JSON into tagged objects
// such as `{ __function__: { name } }`. This turns them back into source-like
// text.
export function formatValue(value: unknown, calls: Record<string, Call>): string {
  if (value === undefined) {
    return 'undefined';
  }
  if (typeof value === 'string') {
    return JSON.stringify(truncate(value));
  }
  if (typeof value !== 'object' || value === null) {
    return String(value);
  }
  if (isCallRef(value)) {
    const call = calls[value.__callId__];
    return call ? formatCall(call, calls) : '…';
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => formatValue(item, calls)).join(', ')}]`;
  }
  const tagged = value as Record<string, Record<string, string> | undefined>;
  if (tagged.__function__) {
    return `${tagged.__function__.name || 'anonymous'}()`;
  }
  if (tagged.__class__) {
    return tagged.__class__.name;
  }
  if (tagged.__element__) {
    return `<${tagged.__element__.localName}>`;
  }
  if (tagged.__error__) {
    return `${tagged.__error__.name}: ${tagged.__error__.message}`;
  }
  if (tagged.__regexp__) {
    return `/${tagged.__regexp__.source}/${tagged.__regexp__.flags}`;
  }
  if (tagged.__date__) {
    return `Date(${tagged.__date__.value})`;
  }
  if (tagged.__symbol__) {
    return `Symbol(${tagged.__symbol__.description ?? ''})`;
  }
  return truncate(JSON.stringify(value) ?? String(value));
}

// Renders a call as a chain, e.g. `expect(3).not.toBe(4)`. Each `CallRef` in
// the path points at the call whose result the method was called on.
export function formatCall(call: Call, calls: Record<string, Call>): string {
  if (call.method === 'step') {
    return String(call.args[0]);
  }
  const path = call.path
    .map((part) => (isCallRef(part) ? formatValue(part, calls) : part))
    .join('.');
  const args = call.args.map((arg) => formatValue(arg, calls)).join(', ');
  return `${path ? `${path}.` : ''}${call.method}(${args})`;
}
