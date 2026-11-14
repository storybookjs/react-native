import type { Meta, StoryObj } from '@storybook/react';
import { Text, View } from 'react-native';

interface GroupedControlsExampleProps {
  label: string;
  disabled: boolean;
  fontSize: number;
  bold: boolean;
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  accessibilityLabel: string;
}

const GroupedControlsExample = ({
  label,
  disabled,
  fontSize,
  bold,
  backgroundColor,
  borderColor,
  borderRadius,
  accessibilityLabel,
}: GroupedControlsExampleProps) => {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={{
        alignSelf: 'flex-start',
        margin: 16,
        padding: 12,
        borderWidth: 2,
        backgroundColor,
        borderColor,
        borderRadius,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ fontSize, fontWeight: bold ? 'bold' : 'normal' }}>{label}</Text>
    </View>
  );
};

// `table.category` groups controls into collapsible sections and `table.subcategory` groups them
// into subsections, the same as the web Controls panel. Controls without either come first.
const meta = {
  title: 'ControlExamples/GroupedControls',
  component: GroupedControlsExample,
  args: {
    label: 'Grouped controls',
    disabled: false,
    fontSize: 16,
    bold: false,
    backgroundColor: '#e3f2fd',
    borderColor: '#1e88e5',
    borderRadius: 8,
    accessibilityLabel: 'Grouped controls example',
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    fontSize: { control: 'number', table: { category: 'Text' } },
    bold: { control: 'boolean', table: { category: 'Text' } },
    backgroundColor: {
      control: 'color',
      table: { category: 'Appearance', subcategory: 'Colors' },
    },
    borderColor: { control: 'color', table: { category: 'Appearance', subcategory: 'Colors' } },
    borderRadius: { control: 'number', table: { category: 'Appearance', subcategory: 'Shape' } },
    accessibilityLabel: { control: 'text', table: { subcategory: 'Accessibility' } },
  },
} satisfies Meta<typeof GroupedControlsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
