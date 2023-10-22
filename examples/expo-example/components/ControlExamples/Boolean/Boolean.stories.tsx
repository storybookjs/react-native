import { ComponentMeta, ComponentStoryObj } from '@storybook/react-native';
import { Switch } from './Boolean';

const BooleanExample: ComponentMeta<typeof Switch> = {
  title: 'ControlExamples/Boolean Control',
  component: Switch,
};

export default BooleanExample;

type BooleanStory = ComponentStoryObj<typeof Switch>;

export const Basic: BooleanStory = {};
