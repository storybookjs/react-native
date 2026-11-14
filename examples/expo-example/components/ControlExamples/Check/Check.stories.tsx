import type { StoryObj, Meta } from '@storybook/react-native';
import { Check } from './Check';

const toppings = ['Cheese', 'Mushrooms', 'Olives', 'Peppers'];

const meta = {
  component: Check,

  argTypes: {
    toppings: {
      options: toppings,
      control: { type: 'check' },
    },
  },
} satisfies Meta<typeof Check>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    toppings: [toppings[0], toppings[2]],
  },
};

export const Inline: Story = {
  argTypes: {
    toppings: {
      options: toppings,
      control: { type: 'inline-check' },
    },
  },
  args: {
    toppings: [toppings[1]],
  },
};

export const WithLabels: Story = {
  argTypes: {
    toppings: {
      options: toppings,
      control: {
        type: 'check',
        labels: {
          Cheese: 'Cheese 🧀',
          Mushrooms: 'Mushrooms 🍄',
          Olives: 'Olives 🫒',
          Peppers: 'Peppers 🫑',
        },
      },
    },
  },
  args: {
    toppings: [],
  },
};
