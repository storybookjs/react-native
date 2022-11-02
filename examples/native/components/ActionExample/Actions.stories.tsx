import { ComponentMeta, ComponentStoryObj } from '@storybook/react-native';
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

type ActionButtonStory = ComponentStoryObj<typeof ActionButton>;

export const Basic: ActionButtonStory = {};

export const AnotherAction: ActionButtonStory = {
  argTypes: {
    onPress: { action: 'pressed a different button' },
  },
};
