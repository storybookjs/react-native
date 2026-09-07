import { Multiply } from './Number';
import preview from '../../../.rnstorybook/preview';

const meta = preview.meta({
  component: Multiply,
});

export default meta;

export const Basic = meta.story({
  args: {
    first: 5,
    second: 3,
  },
});

export const Range = meta.story({
  args: {
    first: 6,
    second: 7,
  },
  argTypes: {
    first: {
      step: 3,
      min: 1,
      max: 42,
      range: true,
    },
  },
});
