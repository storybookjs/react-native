import { Radio } from './Radio';
import preview from '../../../.rnstorybook/preview';

const radio_stations = ['104.8MHz', '909 kHz', '90FM'];

const meta = preview.meta({
  component: Radio,

  argTypes: {
    selection: {
      options: radio_stations,
      control: { type: 'radio' },
    },
  },
});

export default meta;

export const Basic = meta.story({
  args: {
    selection: radio_stations[0],
  },
});
