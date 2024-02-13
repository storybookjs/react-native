import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as ObjectStory from './Object.stories';

const { Basic } = composeStories(ObjectStory);

test('object story renders', () => {
  render(<Basic />);

  screen.getByText('title: Blade Runner');
  screen.getByText('genre: Sci Fi');
  screen.getByText('release year: 1982');
});
