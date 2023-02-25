import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { AButton } from './AButton';
import { ScrollView } from 'react-native';

const SafeAreaInsideMeta: ComponentMeta<typeof AButton> = {
  title: 'SafeArea Inside',
  component: AButton,
  argTypes: {
    onPress: { action: 'pressed the button' },
  },
  args: {
    text: 'Regular layout',
  },
};
export default SafeAreaInsideMeta;

type SafeAreaInsideStory = ComponentStory<typeof AButton>;

export const Basic: SafeAreaInsideStory = (args) => <AButton {...args} />;

export const ListBasic: SafeAreaInsideStory = (args) => (
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
);
