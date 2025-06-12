import { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';

type HiddenControlsProps = {
  value: number;
  padding: number;
  advanced: boolean;
};
const HiddenControls = ({ value, padding }: HiddenControlsProps) => {
  return (
    <View style={{ padding, gap: 10 }}>
      <Text>
        This is a story that allows you to hide controls based on other args. By default, you should
        be able to modify the value but not the padding of this component
      </Text>
      <Text>Your current chosen value is: {value}</Text>
    </View>
  );
};

const meta = {
  component: HiddenControls,
} satisfies Meta<typeof HiddenControls>;

export default meta;

type HiddenControlsStory = StoryObj<typeof meta>;

export const Basic: HiddenControlsStory = {
  argTypes: {
    value: { control: 'number' },
    advanced: { control: 'boolean' },
    padding: { control: 'number', if: { arg: 'advanced' } },
  },
  args: {
    padding: 10,
    value: 42,
    advanced: false,
  },
};
