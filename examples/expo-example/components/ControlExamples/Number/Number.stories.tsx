import type { Meta, StoryObj } from '@storybook/react-native';
import { Multiply } from './Number';

const meta = {
  component: Multiply,
} satisfies Meta<typeof Multiply>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    first: 5,
    second: 3,
  },
};

export const Range: Story = {
  args: {
    first: 6,
    second: 7,
  },
  argTypes: {
    first: {
      step: 3,
      min: 1,
      max: 42,
      range: true,
    },
  },
};
