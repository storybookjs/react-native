import { FC, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { ChevronIcon, ComponentIcon, GroupIcon, StoryIcon } from '../icons';
import { colors } from '../theme/colors';
import { countStories } from '../utils/tree';
import { BASE_PADDING, DEPTH_INDENT } from '../constants';
import type { TreeNode } from '../types';

interface TreeItemProps {
  node: TreeNode;
  isExpanded: boolean;
  isSelected: boolean;
  expandedIds: Set<string>;
  selectedStoryId: string | null;
  onToggle: (node: TreeNode) => void;
  onSelect: (storyId: string) => void;
}

export const TreeItem: FC<TreeItemProps> = ({
  node,
  isExpanded,
  isSelected,
  expandedIds,
  selectedStoryId,
  onToggle,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const paddingLeft = BASE_PADDING + node.depth * DEPTH_INDENT;

  if (node.type === 'story') {
    return (
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={[
          styles.treeItem,
          { paddingLeft: paddingLeft + 14 },
          isHovered && !isSelected && styles.treeItemHover,
          isSelected && styles.treeItemSelected,
        ]}
        onPress={() => node.storyId && onSelect(node.storyId)}
      >
        <StoryIcon color={isSelected ? '#FFFFFF' : colors.seafoam} />
        <Text
          style={[styles.treeItemText, isSelected && styles.treeItemTextSelected]}
          numberOfLines={1}
        >
          {node.name}
        </Text>
      </Pressable>
    );
  }

  const isComponent = node.type === 'component';
  const hasChildren = node.children.length > 0;

  return (
    <View>
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={[styles.treeItem, { paddingLeft }, isHovered && styles.treeItemHover]}
        onPress={() => onToggle(node)}
      >
        {hasChildren ? (
          <View style={styles.chevronWrapper}>
            <ChevronIcon isExpanded={isExpanded} />
          </View>
        ) : (
          <View style={styles.chevronSpacer} />
        )}
        {isComponent ? (
          <ComponentIcon color={colors.secondary} />
        ) : (
          <GroupIcon color={colors.purple} />
        )}
        <Text style={styles.treeItemText} numberOfLines={1}>
          {node.name}
        </Text>
        {hasChildren && <Text style={styles.treeItemCount}>{countStories([node])}</Text>}
      </Pressable>

      {isExpanded && hasChildren && (
        <View>
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              isExpanded={expandedIds.has(child.id)}
              isSelected={selectedStoryId === child.storyId}
              expandedIds={expandedIds}
              selectedStoryId={selectedStoryId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
    paddingVertical: 4,
    paddingRight: 12,
    gap: 6,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  treeItemHover: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  treeItemSelected: {
    backgroundColor: colors.secondary,
  },
  treeItemText: {
    flex: 1,
    fontSize: 13,
    color: colors.textColor,
  },
  treeItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  treeItemCount: {
    fontSize: 11,
    color: colors.textMutedColor,
    backgroundColor: colors.barBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  chevronWrapper: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronSpacer: {
    width: 14,
  },
});
