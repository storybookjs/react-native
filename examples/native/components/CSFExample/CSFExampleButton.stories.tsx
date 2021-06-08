import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Button } from './CSFExampleButton';

const CSFExample: ComponentMeta<typeof Button> = {
  title: 'CSF Example',
  parameters: { notes: '- test' },
};

export default CSFExample;

type ButtonStory = ComponentStory<typeof Button>;

export const CSFExample1: ButtonStory = (args) => <Button {...args} onPress={() => null} />;

CSFExample1.args = {
  text: 'args!!',
};

CSFExample1.parameters = {
  notes: '# notes',
};

export const CSFExample2: ButtonStory = () => <Button text="test2" onPress={() => null} />;

export const CSFExample3: ButtonStory = () => <Button text="test3" onPress={() => null} />;
