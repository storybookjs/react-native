import { render, screen } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic } from './Date.stories';

const DateStory = composeStory(Basic, Meta);

test('date story renders', () => {
  render(<DateStory />);

  const date = new Date(1983, 1, 25);

  screen.getByText(date.toString());
});
