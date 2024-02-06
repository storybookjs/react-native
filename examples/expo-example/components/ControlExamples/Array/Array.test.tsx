import { render, screen } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic } from './Array.stories';

const ArrayStory = composeStory(Basic, Meta);

test('form submits two answers', () => {
  render(<ArrayStory />);

  expect(screen.getByTestId('array-story-container')).toHaveTextContent(/abc/);
});
