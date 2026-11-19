import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react-native';
import * as Color from './Color.stories';

const { ColorExample } = composeStories(Color);

test('color story renders', async () => {
  await render(<ColorExample />);

  expect(screen.getByTestId('color-story-container')).toHaveStyle({ backgroundColor: '#a819b9' });
});
