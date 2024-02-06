import { render, screen } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic, Range } from './Number.stories';

const BasicStory = composeStory(Basic, Meta);
const RangeStory = composeStory(Range, Meta);

test('basic story renders', async () => {
  render(<BasicStory />);

  await screen.findByText(/5 x 3 = 15/);
});

test('range story renders', async () => {
  render(<RangeStory />);

  await screen.findByText(/6 x 7 = 42/);
});
