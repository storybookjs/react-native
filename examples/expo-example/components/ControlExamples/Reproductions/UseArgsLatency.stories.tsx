import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';
import { useArgs, useEffect, useState } from 'storybook/preview-api';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type SegmentedControlProps = {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

type StorySurfaceProps = SegmentedControlProps & {
  title: string;
  description: string;
};

const SegmentedControl = ({ items, selectedIndex, onChange }: SegmentedControlProps) => {
  return (
    <View style={styles.segmentRow}>
      {items.map((item, index) => {
        const selected = index === selectedIndex;

        return (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(index)}
            style={[styles.segmentButton, selected ? styles.segmentButtonSelected : null]}
          >
            <Text style={[styles.segmentLabel, selected ? styles.segmentLabelSelected : null]}>
              {item}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const StorySurface = ({
  title,
  description,
  items,
  selectedIndex,
  onChange,
}: StorySurfaceProps) => {
  return (
    <View style={styles.surface}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <SegmentedControl items={items} selectedIndex={selectedIndex} onChange={onChange} />
      <Text style={styles.caption}>Selected index: {selectedIndex}</Text>
      <Text style={styles.caption}>Selected item: {items[selectedIndex] ?? 'unknown'}</Text>
    </View>
  );
};

const meta = {
  title: 'ControlExamples/Reproductions/UseArgsLatency',
  component: StorySurface,
  args: {
    title: 'useArgs latency repro',
    description: 'Compare how this segmented control feels under different update strategies.',
    items: ['Overview', 'Details', 'Reviews'],
    selectedIndex: 0,
    onChange: fn(),
  },
  argTypes: {
    selectedIndex: {
      control: { type: 'number' },
      description: 'The selected segment index',
    },
    items: {
      control: { type: 'object' },
      description: 'Labels rendered by the segmented control',
    },
    title: {
      control: { type: 'text' },
      description: 'Heading shown above the control',
    },
    description: {
      control: { type: 'text' },
      description: 'Supporting text shown above the control',
    },
    onChange: {
      description: 'Called whenever a segment is pressed',
    },
  },
  parameters: {
    notes: `
Compare these stories when tapping quickly:

- Local state only: baseline, no Storybook args sync.
- useArgs only: closest to direct Storybook control sync.
- useArgs + action: same path plus action logging overhead.
- Optimistic local mirror: immediate local update, Storybook args sync in parallel.
`,
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LocalStateOnly: Story = {
  args: {
    title: 'Local state only',
    description: 'Baseline React state update. This should feel immediate.',
  },
  render: function LocalStateOnlyRender(props) {
    const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex);

    useEffect(() => {
      setSelectedIndex(props.selectedIndex);
    }, [props.selectedIndex]);

    return <StorySurface {...props} selectedIndex={selectedIndex} onChange={setSelectedIndex} />;
  },
};

export const UseArgsOnly: Story = {
  args: {
    title: 'useArgs only',
    description: 'Uses normal story props for rendering and useArgs only to push updates.',
  },
  render: function UseArgsOnlyRender(props) {
    const [, updateArgs] = useArgs<SegmentedControlProps>();

    return <StorySurface {...props} onChange={(index) => updateArgs({ selectedIndex: index })} />;
  },
};

export const UseArgsWithAction: Story = {
  args: {
    title: 'useArgs + action',
    description: 'Matches the common pattern of syncing args and logging the change callback.',
  },
  render: function UseArgsWithActionRender(props) {
    const [, updateArgs] = useArgs<SegmentedControlProps>();

    return (
      <StorySurface
        {...props}
        onChange={(index) => {
          updateArgs({ selectedIndex: index });
          props.onChange(index);
        }}
      />
    );
  },
};

export const OptimisticLocalMirror: Story = {
  args: {
    title: 'Optimistic local mirror',
    description: 'Updates local state immediately and keeps Storybook args in sync behind it.',
  },
  render: function OptimisticLocalMirrorRender(props) {
    const [, updateArgs] = useArgs<SegmentedControlProps>();
    const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex);

    useEffect(() => {
      setSelectedIndex(props.selectedIndex);
    }, [props.selectedIndex]);

    return (
      <StorySurface
        {...props}
        selectedIndex={selectedIndex}
        onChange={(index) => {
          setSelectedIndex(index);
          updateArgs({ selectedIndex: index });
          props.onChange(index);
        }}
      />
    );
  },
};

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f6f4ef',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1d2b2a',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    color: '#405452',
    marginBottom: 16,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#e0ddd2',
    borderWidth: 1,
    borderColor: '#cac5b8',
  },
  segmentButtonSelected: {
    backgroundColor: '#1f7a64',
    borderColor: '#1f7a64',
  },
  segmentLabel: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#23413a',
  },
  segmentLabelSelected: {
    color: '#f8faf8',
  },
  caption: {
    fontSize: 14,
    color: '#4f615f',
    marginBottom: 4,
  },
});
