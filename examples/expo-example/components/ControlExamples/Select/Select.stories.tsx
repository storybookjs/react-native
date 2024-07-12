import type { StoryObj, Meta } from '@storybook/react';
import { SelectExample } from './Select';

const arrows = { ArrowUp: '⬆', ArrowDown: '⬇', ArrowLeft: '⬅️', ArrowRight: '➡️' };

const meta = {
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
} satisfies Meta<typeof SelectExample>;

export default meta;

type SelectExampleStory = StoryObj<typeof meta>;

export const Basic: SelectExampleStory = {
  args: {
    arrow: arrows.ArrowLeft,
  },
};

export const WithLabels: SelectExampleStory = {
  args: {
    arrow: arrows.ArrowUp,
  },

  argTypes: {
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
  },
};

export const WithMapping: SelectExampleStory = {
  args: {
    arrow: 'ArrowRight',
  },

  argTypes: {
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
  },
};
