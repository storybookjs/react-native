import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';

const MyComponent = ({ text }) => <Text>{text}</Text>;

const meta = {
  title: 'NestingExample/Message/bubble',
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const First: Story = {
  args: {
    text: 'First',
  },
};

export const Second: Story = {
  name: 'Second Story',
  args: {
    text: 'Second',
  },
};
