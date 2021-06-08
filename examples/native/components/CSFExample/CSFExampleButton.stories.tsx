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
  buttonText: 'args!!',
};

CSFExample1.parameters = {
  notes: '# notes',
};

export const CSFExample2: ButtonStory = () => <Button buttonText="test2" onPress={() => null} />;

export const CSFExample3: ButtonStory = () => <Button buttonText="test3" onPress={() => null} />;
