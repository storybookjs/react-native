import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { BooleanButton } from './BooleanButton';

const BooleanExample: ComponentMeta<typeof BooleanButton> = {
  title: 'Boolean Example',
  component: BooleanButton,
};

export default BooleanExample;

type BooleanStory = ComponentStory<typeof BooleanButton>;

export const Basic: BooleanStory = (args) => <BooleanButton {...args} />;

Basic.args = {
  isEnabled: true,
};
