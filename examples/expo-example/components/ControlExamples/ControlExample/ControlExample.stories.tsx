import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react-native';
import { ControlExample } from './ControlExample';

export default {
  title: 'Control Example',
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
      options: {
        Apple: 'apple',
        Banana: 'banana',
        Cherry: 'cherry',
      },
      control: { type: 'select' },
    },
    otherFruit: {
      options: {
        Kiwi: 'kiwi',
        Guava: 'guava',
        Watermelon: 'watermelon',
      },
      control: { type: 'radio' },
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
      control: { type: 'array' },
    },
    customStyles: {
      control: { type: 'object' },
    },
    invalid: {
      control: { type: 'nonexistent_type' },
    },
  },
} as ComponentMeta<typeof ControlExample>;

type ControlExampleStory = ComponentStory<typeof ControlExample>;

export const Example: ControlExampleStory = (args) => <ControlExample {...args} />;
