import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { SelectExample } from './SelectExample';

const arrows = { ArrowUp: '⬆', ArrowDown: '⬇', ArrowLeft: '◀', ArrowRight: '▶' };

const SelectExampleMeta: ComponentMeta<typeof SelectExample> = {
  title: 'Select Example',
  component: SelectExample,
  argTypes: {
    arrow: {
      options: ['1', '2'], //Object.keys(arrows),
      //mapping: arrows,
      control: {
        type: 'select',
        //     labels: {
        //       ArrowUp: 'Up',
        //       ArrowDown: 'Down',
        //       ArrowLeft: 'Left',
        //       ArrowRight: 'Right',
      },
      //   },
    },
  },
};

export default SelectExampleMeta;

type SelectExampleStory = ComponentStory<typeof SelectExample>;

export const Basic: SelectExampleStory = (args) => <SelectExample {...args} />;

Basic.args = {
  arrow: '',
};
