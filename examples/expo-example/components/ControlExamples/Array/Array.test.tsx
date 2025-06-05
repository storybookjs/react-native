import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as ArrayStories from './Array.stories';

// @ts-expect-error
const { Basic } = composeStories(ArrayStories);

test('array story renders', () => {
  render(<Basic />);

  expect(screen.getByTestId('array-story-container')).toHaveTextContent(/abc/);
});
