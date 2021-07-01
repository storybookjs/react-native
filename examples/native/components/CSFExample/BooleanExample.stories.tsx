import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { BooleanExampleButton } from './BooleanExampleButton';

const BooleanExample: ComponentMeta<typeof BooleanExampleButton> = {
  title: 'Boolean Example',
  component: BooleanExampleButton,
};

export default BooleanExample;

type BooleanExampleStory = ComponentStory<typeof BooleanExampleButton>;

export const Basic: BooleanExampleStory = (args) => <BooleanExampleButton {...args} />;

Basic.args = {
  isEnabled: true,
};
