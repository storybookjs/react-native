import type { StoryObj, Meta } from '@storybook/react';
import { Radio } from './Radio';

const radio_stations = ['104.8MHz', '909 kHz', '90FM'];

const RadioMeta: Meta<typeof Radio> = {
  title: 'ControlExamples/Radio control',
  component: Radio,
  args: {
    selection: radio_stations[0],
  },
  argTypes: {
    selection: {
      options: radio_stations,
      control: { type: 'radio' },
    },
  },
};

export default RadioMeta;

type RadioStory = StoryObj<typeof Radio>;

export const Basic: RadioStory = {};
