import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as NumberStories from './Number.stories';

const { Basic, Range } = composeStories(NumberStories);

test('basic story renders', async () => {
  render(<Basic />);

  await screen.findByText(/5 x 3 = 15/);
});

test('range story renders', async () => {
  render(<Range />);

  await screen.findByText(/6 x 7 = 42/);
});
