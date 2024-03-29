import React from 'react';
import type { StoryObj, Meta } from '@storybook/react';
import { SelectExample } from './Select';

const arrows = { ArrowUp: '⬆', ArrowDown: '⬇', ArrowLeft: '⬅️', ArrowRight: '➡️' };

const SelectExampleMeta: Meta<typeof SelectExample> = {
  title: 'ControlExamples/Select control',
  component: SelectExample,
  argTypes: {
    arrow: {
      options: Object.values(arrows),
      control: {
        type: 'select',
      },
    },
  },
  parameters: {
    notes: 'Select from mulitple options!',
  },
};

export default SelectExampleMeta;

type SelectExampleStory = StoryObj<typeof SelectExample>;

export const Basic: SelectExampleStory = (args) => <SelectExample {...args} />;

Basic.args = {
  arrow: arrows.ArrowLeft,
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
        [arrows.ArrowUp]: 'Up',
        [arrows.ArrowDown]: 'Down',
        [arrows.ArrowLeft]: 'Left',
        [arrows.ArrowRight]: 'Right',
      },
    },
  },
};

export const WithMapping: SelectExampleStory = (args) => <SelectExample {...args} />;

WithMapping.args = {
  arrow: 'ArrowUp',
};

WithMapping.argTypes = {
  arrow: {
    options: Object.keys(arrows),
    mapping: arrows,
    control: {
      type: 'select',
      labels: {
        ArrowUp: 'Up',
        ArrowDown: 'Down',
        ArrowLeft: 'Left',
        ArrowRight: 'Right',
      },
    },
  },
};
