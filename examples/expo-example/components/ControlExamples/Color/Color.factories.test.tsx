import { render, screen } from '@testing-library/react-native';
import { ColorExample } from './Color.factories.stories';

test('color story renders', async () => {
  await render(<ColorExample.Component />);

  expect(screen.getByTestId('color-story-container')).toHaveStyle({ backgroundColor: '#a819b9' });
});
