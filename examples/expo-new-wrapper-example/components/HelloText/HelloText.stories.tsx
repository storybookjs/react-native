import type { Meta, StoryObj } from '@storybook/react-native';

import { HelloText } from './HelloText';

const meta = {
  component: HelloText,
} satisfies Meta<typeof HelloText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hello: Story = {
  args: {
    message: 'Hello, Storybook',
  },
};

export const Goodbye: Story = {
  args: {
    message: 'Goodbye, Storybook',
  },
};
