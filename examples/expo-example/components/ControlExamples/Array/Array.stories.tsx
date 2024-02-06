import type { StoryObj, Meta } from '@storybook/react';
import { Array } from './Array';

const meta = {
  title: 'ControlExamples/Array control',
  component: Array,
  args: {
    list: ['a', 'b', 'c'],
  },
  argTypes: {
    list: {
      separator: ',',
      control: { type: 'array' },
    },
  },
  parameters: {
    notes:
      'Seems like the array type is not distinguishable from object so you should provide the arg type in this case',
  },
} satisfies Meta<typeof Array>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
