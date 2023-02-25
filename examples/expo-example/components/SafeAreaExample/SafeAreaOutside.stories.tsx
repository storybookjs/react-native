import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { AButton } from './AButton';
import { ScrollView } from 'react-native';

const SafeAreaOutsideMeta: ComponentMeta<typeof AButton> = {
  title: 'SafeArea Outside',
  component: AButton,
  parameters: { noSafeArea: true },
  argTypes: {
    onPress: { action: 'pressed the button' },
  },
  args: {
    text: 'Outside the safe area!',
  },
};
export default SafeAreaOutsideMeta;

type SafeAreaOutsideStory = ComponentStory<typeof AButton>;

export const Basic: SafeAreaOutsideStory = (args) => (
  <>
    <AButton {...args} />
    <AButton {...args} />
  </>
);

export const ListBasic: SafeAreaOutsideStory = (args) => (
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
);
