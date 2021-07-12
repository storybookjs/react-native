import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Switch } from './Boolean';

const BooleanExample: ComponentMeta<typeof Switch> = {
  title: 'Boolean Control',
  component: Switch,
};

export default BooleanExample;

type BooleanStory = ComponentStory<typeof Switch>;

export const Basic: BooleanStory = (args) => <Switch {...args} />;

Basic.args = {
  on: true,
};
