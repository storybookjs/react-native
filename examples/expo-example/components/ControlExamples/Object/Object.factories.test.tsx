import { render, screen } from '@testing-library/react-native';
import { Basic } from './Object.factories.stories';

test('object story renders', async () => {
  await render(<Basic.Component />);

  screen.getByText('title: Blade Runner');
  screen.getByText('genre: Sci Fi');
  screen.getByText('release year: 1982');
});
