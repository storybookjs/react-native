import { render, screen } from '@testing-library/react-native';
import { Basic } from './TextInput.factories.stories';

test('text input story renders', async () => {
  await render(<Basic.Component />);

  screen.getByPlaceholderText('Type something');
});
