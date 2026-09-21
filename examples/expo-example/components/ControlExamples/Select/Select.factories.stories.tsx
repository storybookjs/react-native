import { SelectExample } from './Select';
import preview from '../../../.rnstorybook/preview';

const arrows = {
  ArrowUp: '\u2B06',
  ArrowDown: '\u2B07',
  ArrowLeft: '\u2B05\uFE0F',
  ArrowRight: '\u27A1\uFE0F',
};

const meta = preview.meta({
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
});

export default meta;

export const Basic = meta.story({
  args: {
    arrow: arrows.ArrowLeft,
  },
});

export const WithLabels = meta.story({
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
});

export const WithMapping = meta.story({
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
});
