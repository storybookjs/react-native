import React from 'react';
import { Story, Meta } from '@storybook/react-native';
import { Button } from './CSFExampleButton';

export default {
  title: 'CSF Example',
} as Meta;

export const CSFExample1: Story<{ text: string }> = (args) => (
  <Button {...args} onPress={() => null} />
);

CSFExample1.args = {
  text: 'args!',
};

export const CSFExample2: Story = () => <Button text="test2" onPress={() => null} />;
export const CSFExample3: Story = () => <Button text="test3" onPress={() => null} />;
