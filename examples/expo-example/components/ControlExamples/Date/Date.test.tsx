import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as DateStories from './Date.stories';

const { Basic } = composeStories(DateStories);

test('date story renders', () => {
  render(<Basic />);

  const date = new Date(1983, 1, 25);

  screen.getByText(date.toString());
});
