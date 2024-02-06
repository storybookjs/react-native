import { screen, render } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic } from './Text.stories';

const TextStory = composeStory(Basic, Meta);

test('text story renders', () => {
  render(<TextStory />);

  screen.getByText('Hello world!');
});
