import type { StoryObj, Meta } from '@storybook/react-native';
import { Radio } from './Radio';

const radio_stations = ['104.8MHz', '909 kHz', '90FM'];

const meta = {
  component: Radio,

  argTypes: {
    selection: {
      options: radio_stations,
      control: { type: 'radio' },
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    selection: radio_stations[0],
  },
};
