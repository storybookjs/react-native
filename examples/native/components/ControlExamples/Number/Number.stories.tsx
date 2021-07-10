import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Multiply } from './Number';

const NumberMeta: ComponentMeta<typeof Multiply> = {
  title: 'Number control',
  component: Multiply,
};

export default NumberMeta;

type NumberStory = ComponentStory<typeof Multiply>;

export const Basic: NumberStory = (args) => <Multiply {...args} />;

Basic.args = {
  first: 5,
  second: 3,
};

export const Range: NumberStory = (args) => <Multiply {...args} />;
Range.args = {
  first: 6,
  second: 7,
};
Range.argTypes = {
  first: {
    step: 3,
    min: 1,
    max: 42,
    range: true,
  },
};
