import { render, screen } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic } from './Object.stories';

const ObjectStory = composeStory(Basic, Meta);

test('object story renders', () => {
  render(<ObjectStory />);

  screen.getByText('title: Blade Runner');
  screen.getByText('genre: Sci Fi');
  screen.getByText('release year: 1982');
});
