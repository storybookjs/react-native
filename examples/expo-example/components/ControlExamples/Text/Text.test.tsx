import { screen, render } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as TextStories from './Text.stories';

const { Basic } = composeStories(TextStories);

test('text story renders', async () => {
  await render(<Basic />);

  screen.getByText('Hello world!');
});
