import { render, screen } from '@testing-library/react-native';
import { Basic } from './Check.factories.stories';

test('check story renders', async () => {
  await render(<Basic.Component />);

  screen.getByText('Toppings: Cheese, Olives');
});
