import { screen, render } from '@testing-library/react-native';
import { Basic } from './Text.factories.stories';

test('text story renders', async () => {
  await render(<Basic.Component />);

  screen.getByText('Hello world!');
});
