import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as BooleanStories from './Boolean.stories';

const { Basic, On } = composeStories(BooleanStories);

test('boolean story renders', async () => {
  await render(<Basic />);

  screen.getByText('off');
});

test('boolean story renders on', async () => {
  await render(<On />);

  screen.getByText('on');
});
