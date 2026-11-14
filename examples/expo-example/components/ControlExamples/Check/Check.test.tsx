import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as CheckStories from './Check.stories';

// The check control itself is tested in @storybook/react-native (src/controls/types/Check.test.tsx).

const { Basic, Inline } = composeStories(CheckStories);

test('check story renders', async () => {
  await render(<Basic />);

  screen.getByText('Toppings: Cheese, Olives');
});

test('inline check story renders', async () => {
  await render(<Inline />);

  screen.getByText('Toppings: Mushrooms');
});
