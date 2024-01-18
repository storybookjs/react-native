import type { Meta, StoryObj } from '@storybook/react';
import { ActionButton } from './Actions';

const ActionButtonMeta: Meta<typeof ActionButton> = {
  title: 'ActionButton',
  component: ActionButton,
  argTypes: {
    onPress: { action: 'pressed the button' },
  },
  args: {
    text: 'Press me!',
  },
};
export default ActionButtonMeta;

type ActionButtonStory = StoryObj<typeof ActionButton>;

export const Basic: ActionButtonStory = {};

export const AnotherAction: ActionButtonStory = {
  argTypes: {
    onPress: { action: 'pressed a different button' },
  },
};
