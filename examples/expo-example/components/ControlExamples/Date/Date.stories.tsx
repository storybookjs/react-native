import type { StoryObj, Meta } from '@storybook/react-native';
import { DateString } from './Date';

const date = new Date(1983, 1, 25);

const meta = {
  component: DateString,
  args: { date: date },
  argTypes: { date: { control: { type: 'date' } } },
} satisfies Meta<typeof DateString>;

export default meta;

type DateStory = StoryObj<typeof meta>;

export const Basic: DateStory = {};
