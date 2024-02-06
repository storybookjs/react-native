import { render, screen } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic } from './Radio.stories';

const RadioStory = composeStory(Basic, Meta);

test('radio story renders', () => {
  render(<RadioStory />);

  screen.getByText('104.8MHz');
});
