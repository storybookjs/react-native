import { DateString } from './Date';
import preview from '../../../.storybook/preview';

const date = new Date(1983, 1, 25);

const meta = preview.meta({
  component: DateString,

  argTypes: { date: { control: { type: 'date' } } },
});

export default meta;

export const Basic = meta.story({
  args: {
    date,
  },
});
