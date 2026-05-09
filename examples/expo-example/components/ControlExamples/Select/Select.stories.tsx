import type { StoryObj, Meta } from '@storybook/react-native';
import { SelectExample } from './Select';

const arrows = { ArrowUp: '⬆', ArrowDown: '⬇', ArrowLeft: '⬅️', ArrowRight: '➡️' };

const manyArrows = Array.from({ length: 40 }, (_, index) => `Option ${index + 1}`);

const meta = {
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

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    arrow: arrows.ArrowLeft,
  },
};

export const WithLabels: Story = {
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

export const WithMapping: Story = {
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

export const ManyOptions: Story = {
  args: {
    arrow: manyArrows[0],
  },

  argTypes: {
    arrow: {
      options: manyArrows,
      control: {
        type: 'select',
      },
    },
  },
};

export const MultiSelect: Story = {
  args: {
    arrow: [manyArrows[0], manyArrows[1], manyArrows[2]],
  },

  argTypes: {
    arrow: {
      options: manyArrows,
      control: {
        type: 'multi-select',
      },
    },
  },
};
