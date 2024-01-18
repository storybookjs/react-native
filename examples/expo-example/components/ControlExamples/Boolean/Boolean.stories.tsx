import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Boolean';

const BooleanExample: Meta<typeof Switch> = {
  title: 'ControlExamples/Boolean Control',
  component: Switch,
};

export default BooleanExample;

type BooleanStory = StoryObj<typeof Switch>;

export const Basic: BooleanStory = {};

export const On: BooleanStory = { args: { on: true } };
