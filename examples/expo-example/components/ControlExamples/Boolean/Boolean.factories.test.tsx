import { render, screen } from '@testing-library/react-native';
import { Basic, On } from './Boolean.factories.stories';

test('boolean story renders', async () => {
  await render(<Basic.Component />);

  screen.getByText('off');
});

test('boolean story renders on', async () => {
  await render(<On.Component />);

  screen.getByText('on');
});
