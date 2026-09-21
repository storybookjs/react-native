import { render, screen } from '@testing-library/react-native';
import { Basic } from './Radio.factories.stories';

test('radio story renders', async () => {
  await render(<Basic.Component />);

  screen.getByText('104.8MHz');
});
