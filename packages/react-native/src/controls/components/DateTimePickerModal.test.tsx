import { darkTheme, theme, ThemeProvider } from '@storybook/react-native-theming';
import { act } from 'react';
import { createRoot, type TestInstance } from 'test-renderer';

import { DateTimePickerModal } from './DateTimePickerModal';

// Stands in for the native picker view; it records the props it was last rendered with.
const pickerProps: { current: any } = { current: undefined };
const Picker = (props: any) => {
  pickerProps.current = props;
  return null;
};

const first = new Date(2020, 0, 1, 9, 30);
const second = new Date(2021, 5, 15, 18, 45);
const picked = new Date(2022, 11, 31, 12, 0);

const press = (root: ReturnType<typeof createRoot>, testID: string) => {
  const [button] = root.container.queryAll((node: TestInstance) => node.props.testID === testID);
  // Pressability fires onPress from a click (what accessibility actions send).
  act(() => button.props.onClick({ nativeEvent: {}, persist: () => {} }));
};

const setup = (dark = false) => {
  const root = createRoot();
  roots.push(root);
  const onConfirm = jest.fn();
  const onCancel = jest.fn();

  const render = (props: { date: Date; visible: boolean; mode?: 'date' | 'time' }) =>
    act(() =>
      root.render(
        <ThemeProvider theme={dark ? darkTheme : theme}>
          <DateTimePickerModal
            Picker={Picker as any}
            mode={props.mode ?? 'date'}
            date={props.date}
            visible={props.visible}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        </ThemeProvider>
      )
    );

  return { root, render, onConfirm, onCancel };
};

let roots: ReturnType<typeof createRoot>[] = [];

beforeEach(() => {
  pickerProps.current = undefined;
  // The sheet animates in and out; keep those timers out of real time.
  jest.useFakeTimers();
});

afterEach(() => {
  roots.forEach((root) => act(() => root.unmount()));
  roots = [];
  jest.useRealTimers();
});

test('takes the value on open, keeps the picked value when the arg changes, and confirms it', () => {
  const { root, render, onConfirm } = setup();

  render({ date: first, visible: true });
  expect(pickerProps.current.value).toBe(first);

  act(() => pickerProps.current.onChange({ type: 'set' }, picked));
  // The arg changing while the sheet is open doesn't reset what's been picked.
  render({ date: second, visible: true });
  expect(pickerProps.current.value).toBe(picked);

  press(root, 'storybook-date-time-picker-confirm');
  expect(onConfirm).toHaveBeenCalledWith(picked);
});

test('shows the current value when opened again, and cancel discards the picked value', () => {
  const { root, render, onConfirm, onCancel } = setup();

  render({ date: first, visible: true });
  act(() => pickerProps.current.onChange({ type: 'set' }, picked));
  press(root, 'storybook-date-time-picker-cancel');
  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onConfirm).not.toHaveBeenCalled();

  render({ date: first, visible: false });
  render({ date: second, visible: true, mode: 'time' });
  expect(pickerProps.current.value).toBe(second);
  expect(pickerProps.current.mode).toBe('time');
});

test('labels its buttons and follows the dark theme', () => {
  const { root, render } = setup(true);
  render({ date: first, visible: true });

  for (const label of ['Cancel', 'Confirm']) {
    const [button] = root.container.queryAll(
      (node: TestInstance) => node.props.accessibilityLabel === label
    );
    expect(button.props.accessibilityRole).toBe('button');
  }

  expect(pickerProps.current.display).toBe('spinner');
  expect(pickerProps.current.themeVariant).toBe('dark');
  expect(pickerProps.current.textColor).toBe(darkTheme.color.defaultText);
});
