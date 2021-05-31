import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Button } from './CSFExampleButtonCopy';

const CSFExampleCopy: ComponentMeta<typeof Button> = {
  title: 'CSF Example 2',
};

export default CSFExampleCopy;

type ButtonStory = ComponentStory<typeof Button>;

export const CSFExampleCopy1: ButtonStory = (args) => <Button {...args} onPress={() => null} />;

CSFExampleCopy1.args = {
  text: 'args!',
};

export const CSFExampleCopy2: ButtonStory = () => <Button text="test2" onPress={() => null} />;

export const CSFExampleCopy3: ButtonStory = () => <Button text="test3" onPress={() => null} />;
