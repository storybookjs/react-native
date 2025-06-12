import { Meta, StoryObj } from '@storybook/react-native';

import { MyButton } from './SelectWithNumber';

const meta = {
  component: MyButton,
} satisfies Meta<typeof MyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    number: undefined,
  },
};
