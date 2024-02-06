import { render, screen } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic } from './TextInput.stories';

const TextInputStory = composeStory(Basic, Meta);

test('text input story renders', () => {
  render(<TextInputStory />);

  screen.getByPlaceholderText('Type something');
});
