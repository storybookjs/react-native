import { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { TreeItem } from './TreeItem';
import type { TreeNode } from '../types';

interface StoryTreeProps {
  nodes: TreeNode[];
  expandedIds: Set<string>;
  selectedStoryId: string | null;
  onToggle: (node: TreeNode) => void;
  onSelect: (storyId: string) => void;
}

export const StoryTree: FC<StoryTreeProps> = ({
  nodes,
  expandedIds,
  selectedStoryId,
  onToggle,
  onSelect,
}) => (
  <View style={styles.tree}>
    {nodes.map((node) => (
      <TreeItem
        key={node.id}
        node={node}
        isExpanded={expandedIds.has(node.id)}
        isSelected={selectedStoryId === node.storyId}
        expandedIds={expandedIds}
        selectedStoryId={selectedStoryId}
        onToggle={onToggle}
        onSelect={onSelect}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  tree: {},
});
