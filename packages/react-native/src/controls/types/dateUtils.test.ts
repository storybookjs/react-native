import {
  formatDateInput,
  formatDateLabel,
  formatDateTimeLocal,
  formatTimeInput,
  parseDateInput,
  parseTimeInput,
  toValidDate,
} from './dateUtils';

const base = new Date(2024, 0, 5, 9, 7);

test('formats dates and times in local time', () => {
  expect(formatDateInput(base)).toBe('2024-01-05');
  expect(formatTimeInput(base)).toBe('09:07');
  expect(formatDateLabel(base)).toBe('05-01-2024');
  expect(formatDateTimeLocal(base)).toBe('2024-01-05T09:07');
});

test('parseDateInput keeps the time and rejects invalid dates', () => {
  const parsed = parseDateInput('2025-12-31', base);
  expect(parsed).toEqual(new Date(2025, 11, 31, 9, 7));
  expect(parseDateInput(' 2025-3-4 ', base)).toEqual(new Date(2025, 2, 4, 9, 7));

  expect(parseDateInput('2024-02-30', base)).toBeNull();
  expect(parseDateInput('2024-13-01', base)).toBeNull();
  expect(parseDateInput('05-01-2024', base)).toBeNull();
  expect(parseDateInput('', base)).toBeNull();
  // doesn't mutate the base date
  expect(base).toEqual(new Date(2024, 0, 5, 9, 7));
});

test('parseTimeInput keeps the date and rejects invalid times', () => {
  expect(parseTimeInput('23:59', base)).toEqual(new Date(2024, 0, 5, 23, 59));
  expect(parseTimeInput('7:30', base)).toEqual(new Date(2024, 0, 5, 7, 30));

  expect(parseTimeInput('24:00', base)).toBeNull();
  expect(parseTimeInput('12:60', base)).toBeNull();
  expect(parseTimeInput('12', base)).toBeNull();
});

test('toValidDate falls back to now for invalid values', () => {
  expect(toValidDate(base.valueOf())).toEqual(base);
  expect(toValidDate('not a date').valueOf()).not.toBeNaN();
});
