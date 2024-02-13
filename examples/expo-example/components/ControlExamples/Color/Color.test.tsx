import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as Color from './Color.stories';

const { ColorExample } = composeStories(Color);

test('color story renders', () => {
  render(<ColorExample />);

  expect(screen.getByTestId('color-story-container')).toHaveStyle({ backgroundColor: '#a819b9' });
});
