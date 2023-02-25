import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { DateString } from './Date';

const date = new Date(1983, 1, 25);

const DateMeta: ComponentMeta<typeof DateString> = {
  title: 'Date',
  component: DateString,
  args: { date: date },
  argTypes: { date: { control: { type: 'date' } } },
};

export default DateMeta;

type DateStory = ComponentStory<typeof DateString>;

export const Basic: DateStory = (args) => <DateString {...args} />;
