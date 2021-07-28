import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { ActionButton } from './Actions';

const ActionButtonMeta: ComponentMeta<typeof ActionButton> = {
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

type ActionButtonStory = ComponentStory<typeof ActionButton>;

export const Basic: ActionButtonStory = (args) => <ActionButton {...args} />;

export const AnotherAction: ActionButtonStory = (args) => <ActionButton {...args} />;
AnotherAction.argTypes = {
  onPress: { action: 'pressed a different button' },
};
