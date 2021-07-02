import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { SelectExample } from './SelectExample';

const SelectExampleMeta: ComponentMeta<typeof SelectExample> = {
  title: 'Select Example',
  component: SelectExample,
  argTypes: {
    arrow: {
      options: ['1', '2'],
      control: {
        type: 'select',
      },
    },
  },
};

export default SelectExampleMeta;

type SelectExampleStory = ComponentStory<typeof SelectExample>;

export const Basic: SelectExampleStory = (args) => <SelectExample {...args} />;

Basic.args = {
  arrow: '',
};
