import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as InputStories from './TextInput.stories';

const { Basic } = composeStories(InputStories);

test('text input story renders', async () => {
  await render(<Basic />);

  screen.getByPlaceholderText('Type something');
});
