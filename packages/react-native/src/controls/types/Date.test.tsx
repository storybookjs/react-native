import { theme, ThemeProvider } from '@storybook/react-native-theming';
import { act } from 'react';
import { createRoot, type TestInstance } from 'test-renderer';

import DateType from './Date';

// No native picker, so the control renders the YYYY-MM-DD / HH:mm text inputs.
jest.mock('../optionalNativeModules', () => ({ getDateTimePicker: () => null }));

const initial = new Date(2020, 0, 1, 9, 30);

const field = (root: ReturnType<typeof createRoot>, testID: string) => {
  const [input] = root.container.queryAll(
    (node: TestInstance) => node.props.testID === testID && typeof node.props.onBlur === 'function'
  );
  return input;
};

let roots: ReturnType<typeof createRoot>[] = [];

afterEach(() => {
  roots.forEach((root) => act(() => root.unmount()));
  roots = [];
});

const setup = () => {
  const root = createRoot();
  roots.push(root);
  const onChange = jest.fn();
  act(() =>
    root.render(
      <ThemeProvider theme={theme}>
        <DateType arg={{ name: 'date', value: initial }} onChange={onChange} />
      </ThemeProvider>
    )
  );
  return { root, onChange };
};

describe('Date control fallback inputs', () => {
  it('applies a submitted date once, although submitting also blurs the input', () => {
    const { root, onChange } = setup();
    const input = field(root, 'date-date');

    act(() => input.props.onChangeText('2024-07-15'));
    act(() => input.props.onSubmitEditing());
    act(() => input.props.onBlur());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2024, 6, 15, 9, 30));
  });

  it('applies a time on blur and keeps the date', () => {
    const { root, onChange } = setup();
    const input = field(root, 'date-time');

    act(() => input.props.onChangeText('14:05'));
    act(() => input.props.onBlur());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2020, 0, 1, 14, 5));
  });

  it('does not apply an invalid value', () => {
    const { root, onChange } = setup();
    const input = field(root, 'date-date');

    act(() => input.props.onChangeText('2024-13-40'));
    act(() => input.props.onSubmitEditing());
    act(() => input.props.onBlur());

    expect(onChange).not.toHaveBeenCalled();
  });
});
