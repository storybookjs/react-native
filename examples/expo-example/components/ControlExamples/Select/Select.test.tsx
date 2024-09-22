import { screen, render } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as SelectStories from './Select.stories';

const { Basic, WithLabels, WithMapping } = composeStories(SelectStories);

test('select story renders', () => {
  render(<Basic />);

  screen.getByText('Selected: ⬅️');
});

test('select with labels story renders', () => {
  render(<WithLabels />);

  screen.getByText('Selected: ⬆');
});

// TODO: Fix this test
test.skip('select with mapping story renders', async () => {
  render(<WithMapping />);

  await screen.findByText('Selected: ➡️');
});
