import type { Meta, StoryObj } from '@storybook/react';
import { ComponentNode, GroupNode, StoryNode } from './TreeNode';
import { View } from 'react-native';
import { decorators } from './decorators';

const meta = {
  title: 'UI/Sidebar/TreeNode',
  parameters: { layout: 'fullscreen' },
  component: StoryNode,
  decorators,
} satisfies Meta<typeof StoryNode>;

export default meta;

export const Types: StoryObj<typeof meta> = {
  render: () => (
    <View style={{ flex: 1 }}>
      <ComponentNode>Component</ComponentNode>
      <GroupNode>Group</GroupNode>
      <StoryNode>Story</StoryNode>
    </View>
  ),
  args: {
    children: <></>,
  },
};

export const Expandable = () => (
  <>
    <ComponentNode isExpandable>Collapsed component</ComponentNode>
    <ComponentNode isExpandable isExpanded>
      Expanded component
    </ComponentNode>
    <GroupNode isExpandable>Collapsed group</GroupNode>
    <GroupNode isExpandable isExpanded>
      Expanded group
    </GroupNode>
  </>
);

export const ExpandableLongName = () => (
  <>
    <ComponentNode isExpandable>
      Collapsed component with a very very very very very very very very very very very very very
      very very very very very very veryvery very very very very very very very very veryvery very
      very very very very very very very veryvery very very very very very very very very veryvery
      very very very very very very very very veryvery very very very very very very very very
      veryvery very very very very very very very very veryvery very very very very very very very
      very very long name
    </ComponentNode>
    <ComponentNode isExpandable isExpanded>
      Expanded component with a very very very very very very very very very very very very very
      very very very very very very veryvery very very very very very very very very veryvery very
      very very very very very very very veryvery very very very very very very very very veryvery
      very very very very very very very very veryvery very very very very very very very very
      veryvery very very very very very very very very veryvery very very very very very very very
      very very long name
    </ComponentNode>
    <GroupNode isExpandable>
      Collapsed group with a very very very very very very very very very very very very very very
      very very very very very veryvery very very very very very very very very veryvery very very
      very very very very very very veryvery very very very very very very very very veryvery very
      very very very very very very very veryvery very very very very very very very very veryvery
      very very very very very very very very veryvery very very very very very very very very very
      long name
    </GroupNode>
    <GroupNode isExpandable isExpanded>
      Expanded group with a very very very very very very very very very very very very very very
      very very very very very veryvery very very very very very very very very veryvery very very
      very very very very very very veryvery very very very very very very very very veryvery very
      very very very very very very very veryvery very very very very very very very very veryvery
      very very very very very very very very veryvery very very very very very very very very very
      long name
    </GroupNode>
  </>
);

export const Nested = () => (
  <>
    <GroupNode isExpandable isExpanded depth={0}>
      Zero
    </GroupNode>
    <GroupNode isExpandable isExpanded depth={1}>
      One
    </GroupNode>
    <StoryNode depth={2}>Two</StoryNode>
    <ComponentNode isExpandable isExpanded depth={2}>
      Two
    </ComponentNode>
    <StoryNode depth={3}>Three</StoryNode>
  </>
);
export const Selection = () => (
  <>
    <StoryNode selected={false}>Default story</StoryNode>
    <StoryNode selected>Selected story</StoryNode>
  </>
);

export const SelectionWithLongName = () => (
  <>
    <StoryNode>
      Default story with a very very very very very very very very very very very very very very
      very very very very very veryvery very very very very very very very very veryvery very very
      very very very very very very veryvery very very very very very very very very veryvery very
      very very very very very very very veryvery very very very very very very very very veryvery
      very very very very very very very very veryvery very very very very very very very very very
      long name
    </StoryNode>

    <StoryNode selected>
      Selected story with a very very very very very very very very very very very very very very
      very very very very very veryvery very very very very very very very very veryvery very very
      very very very very very very veryvery very very very very very very very very veryvery very
      very very very very very very very veryvery very very very very very very very very veryvery
      very very very very very very very very veryvery very very very very very very very very very
      long name
    </StoryNode>
  </>
);
