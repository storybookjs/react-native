import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Boolean';

const meta = {
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;

type BooleanStory = StoryObj<typeof meta>;

export const Basic: BooleanStory = {
  args: {
    on: false,
  },
};

export const On: BooleanStory = { args: { on: true } };
