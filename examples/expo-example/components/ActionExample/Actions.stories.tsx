import type { Meta, StoryObj } from '@storybook/react';
import { ActionButton } from './Actions';

const meta = {
  title: 'ActionButton',
  component: ActionButton,
  argTypes: {
    onPress: { action: 'pressed the button' },
  },
  args: {
    text: 'Press me!',
  },
} satisfies Meta<typeof ActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const AnotherAction: Story = {
  argTypes: {
    onPress: { action: 'pressed a different button' },
  },
};
