import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as InputStories from './TextInput.stories';

const { Basic } = composeStories(InputStories);

test('text input story renders', () => {
  render(<Basic />);

  screen.getByPlaceholderText('Type something');
});
