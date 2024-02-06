import { render, screen } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { ColorExample } from './Color.stories';

const ColorStory = composeStory(ColorExample, Meta);

test('color story renders', () => {
  render(<ColorStory />);

  expect(screen.getByTestId('color-story-container')).toHaveStyle({ backgroundColor: '#a819b9' });
});
