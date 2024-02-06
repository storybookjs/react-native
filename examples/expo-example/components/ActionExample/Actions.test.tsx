import { render, screen, userEvent } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic } from './Actions.stories';

const ActionsStory = composeStory(Basic, Meta);

test('action story renders and onpress works', async () => {
  jest.useFakeTimers();

  const onPress = jest.fn();

  render(<ActionsStory onPress={onPress} />);

  const user = userEvent.setup({});

  const actionButton = screen.getByText('Press me!');

  await user.press(actionButton);

  expect(onPress).toHaveBeenCalled();
});
