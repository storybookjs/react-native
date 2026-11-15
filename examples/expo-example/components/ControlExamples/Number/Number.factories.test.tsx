import { render, screen } from '@testing-library/react-native';
import { Basic, Range } from './Number.factories.stories';

test('basic story renders', async () => {
  await render(<Basic.Component />);

  await screen.findByText(/5 x 3 = 15/);
});

test('range story renders', async () => {
  await render(<Range.Component />);

  await screen.findByText(/6 x 7 = 42/);
});
