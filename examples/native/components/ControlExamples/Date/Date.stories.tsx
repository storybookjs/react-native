import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { LocalisedDate } from './Date';

const date = new Date(1983, 1, 25);

const DateMeta: ComponentMeta<typeof LocalisedDate> = {
  title: 'Date',
  component: LocalisedDate,
  args: { date: date },
  argTypes: { date: { control: { type: 'date' } } },
};

export default DateMeta;

type DateStory = ComponentStory<typeof LocalisedDate>;

export const Basic: DateStory = (args) => <LocalisedDate {...args} />;
