import { Meta, StoryObj } from '@storybook/react';
import { ControlExample } from './ControlExample';

const meta = {
  title: 'ControlExamples/Control Example',
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
    test1: true,
    test2: false,
    test3: true,
    test4: false,
    test5: true,
    test6: false,
    test7: true,
    test8: true,
    test9: true,
    test10: true,
  },
  argTypes: {
    age: {
      step: 5,
      min: 0,
      max: 90,
      range: true,
    },
    fruit: {
      options: ['apple', 'banana', 'cherry'],

      control: {
        type: 'select',
        labels: {
          apple: 'Apple',
          banana: 'Banana',
          cherry: 'Cherry',
        },
      },
    },
    otherFruit: {
      options: ['kiwi', 'guava', 'watermelon'],

      control: {
        type: 'radio',
        labels: {
          kiwi: 'Kiwi',
          guava: 'Guava',
          watermelon: 'Watermelon',
        },
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
      // @ts-ignore
      control: { type: 'array' },
    },
    customStyles: {
      control: { type: 'object' },
    },
    invalid: {
      control: { type: 'nonexistent_type' },
    },
  },
} satisfies Meta<typeof ControlExample>;

export default meta;

type ControlExampleStory = StoryObj<typeof ControlExample>;

export const Example: ControlExampleStory = {};
