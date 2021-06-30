import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Button } from './CSFExampleButton';

const CSFExample: ComponentMeta<typeof Button> = {
  title: 'CSF Example',
  parameters: { notes: '- test' },
  argTypes: {
    buttonColor: {
      control: { type: 'color' },
    },
  },
};

export default CSFExample;

type ButtonStory = ComponentStory<typeof Button>;

export const CSFExample1: ButtonStory = (args) => <Button {...args} onPress={() => null} />;

CSFExample1.args = {
  buttonText: 'args!!',
  num: 1,
  buttonColor: '#19ACC5',
};

CSFExample1.parameters = {
  notes: '# notes',
};

export const CSFExample2: ButtonStory = () => (
  <Button buttonText="test2" num={2} onPress={() => null} buttonColor="transparent" />
);

export const CSFExample3: ButtonStory = () => (
  <Button buttonText="test3" num={3} onPress={() => null} buttonColor="transparent" />
);
