import { FC, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { ComponentIcon, ExpandAllIcon, CollapseAllIcon } from '../icons';
import { colors } from '../theme/colors';

interface StoriesHeaderProps {
  storyCount: number;
  groupCount: number;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export const StoriesHeader: FC<StoriesHeaderProps> = ({
  storyCount,
  groupCount,
  onExpandAll,
  onCollapseAll,
}) => {
  const [expandHovered, setExpandHovered] = useState(false);
  const [collapseHovered, setCollapseHovered] = useState(false);

  return (
    <View style={styles.storiesHeader}>
      <View style={styles.storiesHeaderLeft}>
        <ComponentIcon />
        <Text style={styles.storiesTitle}>Stories</Text>
        <Text style={styles.storyCount}>
          {storyCount} in {groupCount}
        </Text>
      </View>
      <View style={styles.expandControls}>
        <Pressable
          onHoverIn={() => setExpandHovered(true)}
          onHoverOut={() => setExpandHovered(false)}
          style={[styles.expandButton, expandHovered && styles.expandButtonHover]}
          onPress={onExpandAll}
        >
          <ExpandAllIcon color={colors.textMutedColor} />
        </Pressable>
        <Pressable
          onHoverIn={() => setCollapseHovered(true)}
          onHoverOut={() => setCollapseHovered(false)}
          style={[styles.expandButton, collapseHovered && styles.expandButtonHover]}
          onPress={onCollapseAll}
        >
          <CollapseAllIcon color={colors.textMutedColor} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  storiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  storiesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storiesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textColor,
  },
  storyCount: {
    fontSize: 11,
    color: colors.textMutedColor,
  },
  expandControls: {
    flexDirection: 'row',
    gap: 4,
  },
  expandButton: {
    padding: 6,
    borderRadius: 4,
  },
  expandButtonHover: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
