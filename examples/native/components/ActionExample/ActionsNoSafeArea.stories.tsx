import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { ActionButton } from './Actions';
import { ScrollView } from 'react-native';

const ActionButtonNSAMeta: ComponentMeta<typeof ActionButton> = {
  title: 'ActionButtonNSA',
  component: ActionButton,
  parameters: { noSafeArea: true },
  argTypes: {
    onPress: { action: 'pressed the button' },
  },
  args: {
    text: 'Press me no safe area!',
  },
};
export default ActionButtonNSAMeta;

type ActionButtonNSAStory = ComponentStory<typeof ActionButton>;

export const BasicNSA: ActionButtonNSAStory = (args) => <ActionButton {...args} />;

export const AnotherActionNSA: ActionButtonNSAStory = (args) => <ActionButton {...args} />;
AnotherActionNSA.argTypes = {
  onPress: { action: 'pressed a different button' },
};

export const ListBasicNSA: ActionButtonNSAStory = (args) => (
  <ScrollView>
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
    <ActionButton {...args} />
  </ScrollView>
);
