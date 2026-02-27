import type { StoryObj, Meta } from '@storybook/react-native';
import { Array } from './Array';

const meta = {
  component: Array,
  args: {
    list: ['a', 'b', 'c'],
  },
  argTypes: {
    list: {
      separator: ',',
      // @ts-expect-error
      control: { type: 'array' },
    },
  },
  parameters: {
    notes: `
This is actually not a proper control type and should be inferred from the object type but is currently an inconsistency in the rn addon.
    `,
    storybookUIVisibility: 'hidden', // visible, hidden
    layout: 'centered', // fullscreen, centered, padded
  },
} satisfies Meta<typeof Array>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  globals: {
    // 👇 Override background value for this story
    backgrounds: { value: 'dark' },
  },
};
