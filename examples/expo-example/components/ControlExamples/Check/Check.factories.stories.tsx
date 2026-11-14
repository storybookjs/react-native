import { Check } from './Check';
import preview from '#.storybook/preview';

const toppings = ['Cheese', 'Mushrooms', 'Olives', 'Peppers'];

const meta = preview.meta({
  component: Check,

  argTypes: {
    toppings: {
      options: toppings,
      control: { type: 'check' },
    },
  },
});

export default meta;

export const Basic = meta.story({
  args: {
    toppings: [toppings[0], toppings[2]],
  },
});
