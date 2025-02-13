import { render, screen } from '@testing-library/react-native';
import * as stories from './Date.stories';

const { Basic } = stories;
test('date story renders', () => {
  // @ts-ignore
  render(<Basic.Component />);

  const date = new Date(1983, 1, 25);

  screen.getByText(date.toString());
});
