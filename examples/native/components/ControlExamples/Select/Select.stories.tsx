import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { SelectExample } from './Select';

const ArrowUp = '⬆';
const ArrowDown = '⬇';
const ArrowLeft = '⬅️';
const ArrowRight = '➡️';
const arrows = { ArrowUp, ArrowDown, ArrowLeft, ArrowRight };

const SelectExampleMeta: ComponentMeta<typeof SelectExample> = {
  title: 'Select control',
  component: SelectExample,
  argTypes: {
    arrow: {
      options: [ArrowUp, ArrowDown, ArrowLeft, ArrowRight],
      control: {
        type: 'select',
      },
    },
  },
  parameters: {
    notes: 'currently mapping is not working.',
  },
};

export default SelectExampleMeta;

type SelectExampleStory = ComponentStory<typeof SelectExample>;

export const Basic: SelectExampleStory = (args) => <SelectExample {...args} />;

Basic.args = {
  arrow: ArrowLeft,
};

export const WithLabels: SelectExampleStory = (args) => <SelectExample {...args} />;

WithLabels.args = {
  arrow: arrows.ArrowUp,
};

WithLabels.argTypes = {
  arrow: {
    options: Object.values(arrows),
    control: {
      type: 'select',
      labels: {
        [ArrowUp]: 'Up',
        [ArrowDown]: 'Down',
        [ArrowLeft]: 'Left',
        [ArrowRight]: 'Right',
      },
    },
  },
};

//TODO: mapping
