import { render, screen } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic, Range } from './Number.stories';

const BasicStory = composeStory(Basic, Meta);
const RangeStory = composeStory(Range, Meta);

test('basic story renders', () => {
  render(<BasicStory />);

  screen.getByText(/5 x 3 = 15/);
});

test('range story renders', () => {
  render(<RangeStory />);

  screen.getByText(/6 x 7 = 42/);
});
