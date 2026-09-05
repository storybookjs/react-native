import type { Meta, StoryObj } from '@storybook/react';
import { Appearance, Text, View } from 'react-native';

interface DisabledControlsExampleProps {
  label: string;
  controlFalse: string;
  controlDisable: string;
  tableDisable: string;
  excluded: string;
}

const DisabledControlsExample = (props: DisabledControlsExampleProps) => {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ color: Appearance.getColorScheme() === 'dark' ? 'white' : 'black' }}>
        {JSON.stringify(props, null, 2)}
      </Text>
    </View>
  );
};

// Every way Storybook lets a story hide a single control from the Controls panel. The component
// renders all of its props, so a hidden control still has a value; it just can't be edited.
const meta = {
  title: 'ControlExamples/DisabledControls',
  component: DisabledControlsExample,
  args: {
    label: 'editable',
    controlFalse: 'hidden via control: false',
    controlDisable: 'hidden via control: { disable: true }',
    tableDisable: 'hidden via table: { disable: true }',
    excluded: 'hidden via parameters.controls.exclude',
  },
  argTypes: {
    label: { control: 'text' },
    controlFalse: { control: false },
    controlDisable: { control: { disable: true } },
    tableDisable: { control: 'text', table: { disable: true } },
    excluded: { control: 'text' },
  },
  parameters: {
    controls: { exclude: ['excluded'] },
  },
} satisfies Meta<typeof DisabledControlsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

// Only the `label` control should appear in the panel.
export const OnlyLabelEditable: Story = {};

// Every control is hidden, so the panel shows the "not configured to handle controls" message.
export const AllDisabled: Story = {
  argTypes: {
    label: { control: false },
  },
};
