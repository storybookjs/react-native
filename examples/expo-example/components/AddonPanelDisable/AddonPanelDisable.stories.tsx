import type { Meta, StoryObj } from '@storybook/react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fn } from 'storybook/test';

type AddonPanelDisableDemoProps = {
  label: string;
  count: number;
  enabled: boolean;
  onPress: () => void;
};

const AddonPanelDisableDemo = ({ label, count, enabled, onPress }: AddonPanelDisableDemoProps) => (
  <View style={styles.container}>
    <Text style={styles.heading}>{label}</Text>
    <Text style={styles.body}>Count: {count}</Text>
    <Text style={styles.body}>Enabled: {enabled ? 'true' : 'false'}</Text>
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>Log action</Text>
    </Pressable>
  </View>
);

const meta = {
  title: 'AddonPanelDisable',
  component: AddonPanelDisableDemo,
  args: {
    label: 'Addon panel disable test',
    count: 1,
    enabled: true,
    onPress: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    count: { control: 'number' },
    enabled: { control: 'boolean' },
  },
  parameters: {
    notes: `
# Addon panel disable test

Use these stories to manually verify \`parameters[paramKey].disable\`.
`,
    backgrounds: {
      options: {
        panelDisableLight: { name: 'Panel disable light', value: '#f7f2e8' },
        panelDisableDark: { name: 'Panel disable dark', value: '#20232a' },
      },
    },
  },
} satisfies Meta<typeof AddonPanelDisableDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllPanelsEnabled: Story = {};

export const ControlsDisabled: Story = {
  parameters: {
    controls: { disable: true },
  },
};

export const ActionsDisabled: Story = {
  parameters: {
    actions: { disable: true },
  },
};

export const BackgroundsDisabled: Story = {
  parameters: {
    backgrounds: { disable: true },
  },
};

export const NotesDisabled: Story = {
  parameters: {
    notes: { disable: true },
  },
};

export const FirstPanelDisabled: Story = {
  parameters: {
    controls: { disable: true },
  },
};

export const LastPanelOnly: Story = {
  parameters: {
    actions: { disable: true },
    backgrounds: { disable: true },
    controls: { disable: true },
  },
};

export const AllPanelsDisabled: Story = {
  parameters: {
    actions: { disable: true },
    backgrounds: { disable: true },
    controls: { disable: true },
    notes: { disable: true },
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1ea7fd',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
