import { ControlExample } from './ControlExample';
import preview from '../../../.rnstorybook/preview';

const meta = preview.meta({
  component: ControlExample,
  args: {
    name: 'Storyteller',
    age: 70,
    fruit: 'apple',
    otherFruit: 'watermelon',
    dollars: 12.5,
    backgroundColor: '#eaeaea',
    items: ['Laptop', 'Book', 'Whiskey'],
    customStyles: {
      borderWidth: 3,
      borderColor: '#000',
      padding: 10,
    },
    nice: true,
    birthday: new Date(2017, 0, 20),
  },
  argTypes: {
    age: {
      step: 5,
      min: 0,
      max: 90,
      range: true,
    },
    fruit: {
      options: ['apple', 'banana', 'cherry'] as const,

      control: {
        type: 'select',
        labels: {
          apple: 'Apple',
          banana: 'Banana',
          cherry: 'Cherry',
        } as const,
      },
    },
    otherFruit: {
      options: ['kiwi', 'guava', 'watermelon'] as const,
      control: {
        type: 'radio',
        labels: {
          kiwi: 'Kiwi',
          guava: 'Guava',
          watermelon: 'Watermelon',
        } as const,
      },
    },
    dollars: {
      min: 0,
      max: 100,
    },
    birthday: {
      control: { type: 'date' },
    },
    backgroundColor: {
      control: { type: 'color' },
    },
    items: {
      control: {
        // @ts-expect-error
        type: 'array' as ControlType,
      },
    },
    customStyles: {
      control: { type: 'object' },
    },
    // @ts-ignore
    invalid: {
      // @ts-ignore
      control: { type: 'nonexistent_type' },
    },
  },
});

export default meta;

export const Example = meta.story({});
