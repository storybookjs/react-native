import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as RadioStories from './Radio.stories';

const { Basic } = composeStories(RadioStories);

test('radio story renders', () => {
  render(<Basic />);

  screen.getByText('104.8MHz');
});
