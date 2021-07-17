import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Radio } from './Radio';

const radio_stations = ['104.8MHz', '909 kHz', '90FM'];

const RadioMeta: ComponentMeta<typeof Radio> = {
  title: 'Radio control',
  component: Radio,
  args: {
    selection: radio_stations[0],
  },
  argTypes: {
    selection: {
      options: radio_stations,
      control: { type: 'radios' },
    },
  },
};

export default RadioMeta;

type RadioStory = ComponentStory<typeof Radio>;

export const Basic: RadioStory = (args) => <Radio {...args} />;
