import { fireEvent, render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import { ThemeProvider, theme } from '@storybook/react-native-theming';
import { getControlArgTypes } from '@storybook/addon-ondevice-controls/dist/controlArgTypes';
import PropField from '@storybook/addon-ondevice-controls/dist/PropField';
import * as CheckStories from './Check.stories';

const { Basic, Inline, WithLabels } = composeStories(CheckStories);

const renderControl = (
  story: typeof Basic,
  args: Record<string, unknown> = story.args,
  onChange = jest.fn()
) => {
  const { toppings } = getControlArgTypes(story.argTypes, args);

  return render(
    <ThemeProvider theme={theme}>
      <PropField arg={toppings} isPristine onChange={onChange} />
    </ThemeProvider>
  );
};

test('check story renders', async () => {
  await render(<Basic />);

  screen.getByText('Toppings: Cheese, Olives');
});

test('inline check story renders', async () => {
  await render(<Inline />);

  screen.getByText('Toppings: Mushrooms');
});

test('check control shows a checkbox per option with the selected values checked', async () => {
  await renderControl(Basic);

  const checkboxes = screen.getAllByRole('checkbox');

  expect(checkboxes).toHaveLength(4);
  expect(screen.getByRole('checkbox', { name: 'Cheese' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Mushrooms' })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Olives' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Peppers' })).not.toBeChecked();
});

test('checking an option adds its value in the order of the options', async () => {
  const onChange = jest.fn();
  await renderControl(Basic, Basic.args, onChange);

  await fireEvent.press(screen.getByRole('checkbox', { name: 'Mushrooms' }));

  expect(onChange).toHaveBeenCalledWith(['Cheese', 'Mushrooms', 'Olives']);
});

test('unchecking an option removes its value', async () => {
  const onChange = jest.fn();
  await renderControl(Basic, Basic.args, onChange);

  await fireEvent.press(screen.getByRole('checkbox', { name: 'Cheese' }));

  expect(onChange).toHaveBeenCalledWith(['Olives']);
});

test('checking several options in a row keeps every change', async () => {
  const onChange = jest.fn();
  // The arg isn't updated between presses, as when the update is still on its way through the
  // channel.
  await renderControl(Basic, Basic.args, onChange);

  await fireEvent.press(screen.getByRole('checkbox', { name: 'Mushrooms' }));
  await fireEvent.press(screen.getByRole('checkbox', { name: 'Peppers' }));
  await fireEvent.press(screen.getByRole('checkbox', { name: 'Cheese' }));

  expect(onChange).toHaveBeenLastCalledWith(['Mushrooms', 'Olives', 'Peppers']);
  expect(screen.getByRole('checkbox', { name: 'Cheese' })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Peppers' })).toBeChecked();
});

test('check control follows the arg when it changes from outside', async () => {
  const { toppings } = getControlArgTypes(Basic.argTypes, Basic.args);
  const renderField = (arg: typeof toppings) => (
    <ThemeProvider theme={theme}>
      <PropField arg={arg} isPristine onChange={jest.fn()} />
    </ThemeProvider>
  );
  const { rerender } = await render(renderField(toppings));

  await fireEvent.press(screen.getByRole('checkbox', { name: 'Peppers' }));
  expect(screen.getByRole('checkbox', { name: 'Peppers' })).toBeChecked();

  // For example, the args being reset to the story's initial args.
  await rerender(renderField({ ...toppings, value: ['Mushrooms'] }));

  expect(screen.getByRole('checkbox', { name: 'Mushrooms' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Cheese' })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Olives' })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Peppers' })).not.toBeChecked();
});

test('check control treats a missing value as nothing selected', async () => {
  const onChange = jest.fn();
  await renderControl(Basic, {}, onChange);

  for (const checkbox of screen.getAllByRole('checkbox')) {
    expect(checkbox).not.toBeChecked();
  }

  await fireEvent.press(screen.getByRole('checkbox', { name: 'Peppers' }));

  expect(onChange).toHaveBeenCalledWith(['Peppers']);
});

test('check control treats a single value as one selection', async () => {
  const onChange = jest.fn();
  await renderControl(Basic, { toppings: 'Olives' }, onChange);

  expect(screen.getByRole('checkbox', { name: 'Olives' })).toBeChecked();

  await fireEvent.press(screen.getByRole('checkbox', { name: 'Cheese' }));

  expect(onChange).toHaveBeenCalledWith(['Cheese', 'Olives']);
});

test('check control drops values that are not options', async () => {
  const onChange = jest.fn();
  await renderControl(Basic, { toppings: ['Anchovies', 'Olives'] }, onChange);

  await fireEvent.press(screen.getByRole('checkbox', { name: 'Cheese' }));

  expect(onChange).toHaveBeenCalledWith(['Cheese', 'Olives']);
});

test('check control shows labels but changes the option values', async () => {
  const onChange = jest.fn();
  await renderControl(WithLabels, WithLabels.args, onChange);

  await fireEvent.press(screen.getByRole('checkbox', { name: 'Olives 🫒' }));

  expect(onChange).toHaveBeenCalledWith(['Olives']);
});

test('inline-check uses the check control', async () => {
  await renderControl(Inline);

  expect(screen.getAllByRole('checkbox')).toHaveLength(4);
  expect(screen.getByRole('checkbox', { name: 'Mushrooms' })).toBeChecked();
});
