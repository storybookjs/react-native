import { screen, render } from '@testing-library/react-native';
import { Basic, WithLabels, WithMapping } from './Select.factories.stories';

test('select story renders', async () => {
  await render(<Basic.Component />);

  screen.getByText('Selected: ⬅️');
});

test('select with labels story renders', async () => {
  await render(<WithLabels.Component />);

  screen.getByText('Selected: ⬆');
});

// TODO: Fix this test
test.skip('select with mapping story renders', async () => {
  await render(<WithMapping.Component />);

  await screen.findByText('Selected: ➡️');
});
