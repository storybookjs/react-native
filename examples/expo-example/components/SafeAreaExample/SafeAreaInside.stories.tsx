import React from 'react';
import type { StoryObj, Meta } from '@storybook/react';
import { AButton } from './AButton';
import { ScrollView } from 'react-native';

const InsideSafeAreaMeta: Meta<typeof AButton> = {
  title: 'SafeAreaExamples/Inside SafeArea',
  component: AButton,
  argTypes: {
    onPress: { action: 'pressed the button' },
  },
  args: {
    text: 'Regular layout',
  },
};
export default InsideSafeAreaMeta;

type InsideSafeAreaStory = StoryObj<typeof AButton>;

export const Basic: InsideSafeAreaStory = {};

export const ListBasic: InsideSafeAreaStory = {
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
      <AButton {...args} />
    </ScrollView>
  ),
};
