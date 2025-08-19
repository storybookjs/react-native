import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';

const StoryName = ({ name }: { name: string }) => <Text>{name}</Text>;

const meta = {
  component: StoryName,
} satisfies Meta<typeof StoryName>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithStoryName: Story = {
  storyName: 'story name here',
  args: {
    name: 'story name here',
  },
};

export const WithName: Story = {
  storyName: 'name here',
  args: {
    name: 'name here',
  },
};

export const WithNoName: Story = {
  args: {
    name: 'no name here',
  },
};

export const CSF2Example = (args: { name: string }) => <StoryName {...args} />;
CSF2Example.args = { name: 'csf2 with no name' };

export const CSF2ExampleWithName = (args: { name: string }) => <StoryName {...args} />;
CSF2ExampleWithName.storyName = 'csf2 with name';
CSF2ExampleWithName.args = { name: 'csf2 with name' };
