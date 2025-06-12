import type { StoryObj, Meta } from '@storybook/react-native';
import { AButton } from './AButton';
import { ScrollView } from 'react-native';

const OutsideSafeAreaMeta: Meta<typeof AButton> = {
  component: AButton,
  parameters: { noSafeArea: true },
  argTypes: {
    onPress: { action: 'pressed the button' },
  },
  args: {
    text: 'Outside the safe area!',
  },
};
export default OutsideSafeAreaMeta;

type OutsideSafeAreaStory = StoryObj<typeof AButton>;

export const Basic: OutsideSafeAreaStory = {
  render: (args) => (
    <>
      <AButton {...args} />
      <AButton {...args} />
    </>
  ),
};

export const ListBasic: OutsideSafeAreaStory = {
  render: (args) => (
    <ScrollView>
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} text="Press the bottom right square button to hide the navbar" />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
      <AButton {...args} />
    </ScrollView>
  ),
};
