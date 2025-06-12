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

export const Primary: Story = {
  args: {
    title: 'Sign In',
  },
};

export const Secondary: Story = {
  args: {
    title: 'Create Account',
    variant: 'secondary',
  },
};

export const Loading: Story = {
  args: {
    title: 'Sign In',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    title: 'Sign In',
    disabled: true,
  },
};

export const SecondaryLoading: Story = {
  args: {
    title: 'Create Account',
    variant: 'secondary',
    loading: true,
  },
};

export const SecondaryDisabled: Story = {
  args: {
    title: 'Create Account',
    variant: 'secondary',
    disabled: true,
  },
};

export const LongTitle: Story = {
  args: {
    title: 'This is a very long button title that might affect layout',
  },
};
