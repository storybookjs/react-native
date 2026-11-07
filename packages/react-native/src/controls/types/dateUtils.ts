const pad = (value: number) => `${value}`.padStart(2, '0');

/** Turns a date arg (a Date, timestamp or date string) into a Date, using now when it's invalid. */
export function toValidDate(value: unknown): Date {
  const date = new Date(value as any);
  return isNaN(date.valueOf()) ? new Date() : date;
}

/** `YYYY-MM-DD` in local time. */
export function formatDateInput(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `HH:mm` in local time. */
export function formatTimeInput(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** `DD-MM-YYYY`, the label the native picker buttons show. */
export function formatDateLabel(date: Date): string {
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

/** `YYYY-MM-DDTHH:mm`, the value of an `<input type="datetime-local">`. */
export function formatDateTimeLocal(date: Date): string {
  return `${formatDateInput(date)}T${formatTimeInput(date)}`;
}

/**
 * Applies a `YYYY-MM-DD` string to `base`, keeping its time. Returns null when the text isn't a
 * real calendar date (e.g. 2024-02-30).
 */
export function parseDateInput(text: string, base: Date): Date | null {
  const match = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s*$/.exec(text);
  if (!match) return null;

  const [year, month, day] = match.slice(1).map(Number);
  const next = new Date(base.valueOf());
  next.setFullYear(year, month - 1, day);

  if (next.getFullYear() !== year || next.getMonth() !== month - 1 || next.getDate() !== day) {
    return null;
  }

  return next;
}

/** Applies an `HH:mm` (24 hour) string to `base`, keeping its date. Returns null when invalid. */
export function parseTimeInput(text: string, base: Date): Date | null {
  const match = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(text);
  if (!match) return null;

  const [hours, minutes] = match.slice(1).map(Number);
  if (hours > 23 || minutes > 59) return null;

  const next = new Date(base.valueOf());
  next.setHours(hours, minutes);
  return next;
}
