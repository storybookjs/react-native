import preview from '../../.rnstorybook/preview';
import { Text } from 'react-native';

const StoryName = ({ name }: { name: string }) => <Text>{name}</Text>;

const meta = preview.meta({
  component: StoryName,
});

export default meta;

export const WithStoryName = meta.story({
  name: 'story name here',
  args: { name: 'story name here' },
});

export const WithName = meta.story({
  name: 'name here',
  args: { name: 'name here' },
});

export const WithNoName = meta.story({
  args: { name: 'no name here' },
});

export const CSF2Example = meta.story({
  render: (args) => <StoryName {...args} />,
  args: { name: 'csf2 with no name' },
});

export const CSF2ExampleWithName = meta.story({
  name: 'csf2 with name',
  render: (args) => <StoryName {...args} />,
  args: { name: 'csf2 with name' },
});
