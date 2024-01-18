import type { StoryObj, Meta } from '@storybook/react';
import { DateString } from './Date';

const date = new Date(1983, 1, 25);

const DateMeta: Meta<typeof DateString> = {
  title: 'ControlExamples/Date',
  component: DateString,
  args: { date: date },
  argTypes: { date: { control: { type: 'date' } } },
};

export default DateMeta;

type DateStory = StoryObj<typeof DateString>;

export const Basic: DateStory = {};
