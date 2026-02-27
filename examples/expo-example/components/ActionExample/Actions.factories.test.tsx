import { render, screen, userEvent } from '@testing-library/react-native';
import { Basic } from './Actions.factories.stories';

test('action story renders and onpress works', async () => {
  jest.useFakeTimers();

  const onPress = jest.fn();

  await render(<Basic.Component onPress={onPress} />);

  const user = userEvent.setup({});

  const actionButton = screen.getByText('Press me!');

  await user.press(actionButton);

  expect(onPress).toHaveBeenCalled();
});
