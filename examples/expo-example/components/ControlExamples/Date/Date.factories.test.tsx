import { render, screen } from '@testing-library/react-native';
import { Basic } from './Date.factories.stories';

test('date story renders', async () => {
  await render(<Basic.Component />);

  const date = new Date(1983, 1, 25);

  screen.getByText(date.toString());
});
