import type { StoryObj, Meta } from '@storybook/react';
import { CheckExample } from './Check';

const meta: Meta<typeof CheckExample> = {
  title: 'ControlExamples/Check',
  component: CheckExample,
  argTypes: {
    rotationAxis: {
      control: 'check',
      options: ['x', 'y', 'z'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const XAxis: Story = {
  args: {
    rotationAxis: ['x'],
  },
};

export const YAxis: Story = {
  args: {
    rotationAxis: ['y'],
  },
};

export const ZAxis: Story = {
  args: {
    rotationAxis: ['z'],
  },
};

export const XYZAxis: Story = {
  args: {
    rotationAxis: ['x', 'y', 'z'],
  },
};
