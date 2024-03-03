import { render, screen, userEvent } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as Actions from './Actions.stories';

const { Basic } = composeStories(Actions);

test('action story renders and onpress works', async () => {
  jest.useFakeTimers();

  const onPress = jest.fn();

  render(<Basic onPress={onPress} />);

  const user = userEvent.setup({});

  const actionButton = screen.getByText('Press me!');

  await user.press(actionButton);

  expect(onPress).toHaveBeenCalled();
});
