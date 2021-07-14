import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Array } from './Array';

const ArrayMeta: ComponentMeta<typeof Array> = {
  title: 'Array control',
  component: Array,
  args: {
    list: ['a', 'b', 'c'],
  },
  argTypes: {
    list: {
      separator: ',',
      control: { type: 'array' },
    },
  },
  parameters: {
    notes:
      'Seems like the array type is not distinguishable from object so you should provide the arg type in this case',
  },
};

export default ArrayMeta;

type ArrayStory = ComponentStory<typeof Array>;

export const Basic: ArrayStory = (args) => <Array {...args} />;
