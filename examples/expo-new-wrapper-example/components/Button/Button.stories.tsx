import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { Button } from './Button';

const meta = {
  component: Button,
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Press me',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Press me',
    disabled: true,
  },
};
