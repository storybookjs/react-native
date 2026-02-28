import { styled } from '@storybook/react-native-theming';
import type { ExpandAction, ExpandedState } from '@storybook/react-native-ui-common';
import {
  createId,
  getAncestorIds,
  getDescendantIds,
  IconButton,
  isStoryHoistable,
  Item,
  useExpanded,
  startCase,
} from '@storybook/react-native-ui-common';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { LegendList, LegendListRef, LegendListRenderItemProps } from './LegendList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelectedNode } from './SelectedNodeProvider';
import type {
  ComponentEntry,
  GroupEntry,
  State,
  StoriesHash,
  StoryEntry,
} from 'storybook/manager-api';
import { ComponentNode, GroupNode, StoryNode } from './TreeNode';
import { CollapseAllIcon, CollapseIcon, ExpandAllIcon } from './icon/iconDataUris';

interface NodeProps {
  item: Item;
  refId: string;
  docsMode: boolean;
  isOrphan: boolean;
  isDisplayed: boolean;
  color: string | undefined;
  isSelected: boolean;
  isFullyExpanded?: boolean;
  isExpanded: boolean;
  setExpanded: (action: ExpandAction) => void;
  setFullyExpanded?: () => void;
  onSelectStoryId: (itemId: string) => void;
  status: State['status'][keyof State['status']];
}

export const Node = React.memo<NodeProps>(function Node({
  item,
  refId,
  isOrphan: _isOrphan,
  isDisplayed: _isDisplayed,
  isSelected,
  isFullyExpanded,
  color: _2,
  setFullyExpanded,
  isExpanded,
  setExpanded,
  onSelectStoryId,
}) {
  const id = createId(item.id, refId);

  if (item.type === 'story') {
    return (
      <LeafNodeStyleWrapper accessible={false}>
        <StoryNode
          selected={isSelected}
          key={id}
          id={id}
          depth={item.depth}
          onPress={() => {
            onSelectStoryId(item.id);
          }}
        >
          {(item.renderLabel as (i: typeof item) => React.ReactNode)?.(item) || item.name}
        </StoryNode>
      </LeafNodeStyleWrapper>
    );
  }

  if (item.type === 'root') {
    return (
      <RootNode key={id} id={id}>
        <CollapseButton
          data-action="collapse-root"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={(event) => {
            event.preventDefault();
            setExpanded({ ids: [item.id], value: !isExpanded });
          }}
          accessibilityRole="button"
          aria-expanded={isExpanded}
        >
          <CollapseIcon isExpanded={isExpanded} />
          <RootNodeText>{startCase(item.name)}</RootNodeText>
        </CollapseButton>
        {isExpanded && (
          <IconButton
            aria-label={isFullyExpanded ? 'Expand' : 'Collapse'}
            data-action="expand-all"
            data-expanded={isFullyExpanded}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={(event) => {
              event.preventDefault();
              setFullyExpanded();
            }}
          >
            {isFullyExpanded ? <CollapseAllIcon /> : <ExpandAllIcon />}
          </IconButton>
        )}
      </RootNode>
    );
  }

  if (item.type === 'component' || item.type === 'group') {
    const BranchNode = item.type === 'component' ? ComponentNode : GroupNode;
    return (
      <BranchNode
        key={id}
        id={id}
        aria-controls={item.children && item.children[0]}
        aria-expanded={isExpanded}
        depth={item.depth}
        isComponent={item.type === 'component'}
        isExpandable={item.children && item.children.length > 0}
        isExpanded={isExpanded}
        onPress={(event) => {
          event.preventDefault();
          setExpanded({ ids: [item.id], value: !isExpanded });
        }}
      >
        {startCase(item.name)}
      </BranchNode>
    );
  }

  return null;
});

export const LeafNodeStyleWrapper = styled.View(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingRight: 20,
  color: theme.color.defaultText,
  backgroundColor: 'transparent',
  minHeight: 34,
  borderRadius: 4,
}));

export const RootNode = styled.View(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 16,
  marginBottom: 4,
  minHeight: 34,
}));

export const RootNodeText = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  fontWeight: theme.typography.weight.bold,
  color: theme.textMutedColor,
  lineHeight: 16,
  letterSpacing: 2.5,
  textTransform: 'uppercase',
}));

const CollapseButton = styled.TouchableOpacity(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  paddingHorizontal: 8,
  paddingTop: 8,
  paddingBottom: 7,
  borderRadius: 4,
  gap: 6,
  alignItems: 'center',
  cursor: 'pointer',
  minHeight: 34,
}));

const flexStyle: ViewStyle = { flex: 1 };

// getEstimatedItemSize provides item size estimates for LegendList
// Root items have marginTop (16) + marginBottom (4) + minHeight (28) = 48px
// All other items have minHeight = 28px
const ITEM_HEIGHT = 34;
const ROOT_ITEM_HEIGHT = 54; // 34 + 16 (marginTop) + 4 (marginBottom)

const getEstimatedItemSize = (
  item: {
    itemId: string;
    item: {
      type: 'root' | 'component' | 'story' | 'docs';
      id: string;
      name: string;
      children: string[];
      parent: string | null;
      depth: number;
    };
    isRoot: boolean;
    isOrphan: boolean;
  },
  _index: number
) => {
  return item?.isRoot ? ROOT_ITEM_HEIGHT : ITEM_HEIGHT;
};

export const Tree = React.memo<{
  isBrowsing: boolean;
  isMain: boolean;
  status?: State['status'];
  refId: string;
  data: StoriesHash;
  docsMode: boolean;
  selectedStoryId: string | null;
  onSelectStoryId: (storyId: string) => void;
}>(function Tree({ isMain, refId, data, status, docsMode, selectedStoryId, onSelectStoryId }) {
  const { registerCallback } = useSelectedNode();
  const [idToScrolllOnMount, setIdToScrolllOnMount] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const listRef = useRef<LegendListRef | null>(null);
  // Find top-level nodes and group them so we can hoist any orphans and expand any roots.
  const [rootIds, orphanIds, initialExpanded] = useMemo(
    () =>
      Object.keys(data).reduce<[string[], string[], ExpandedState]>(
        (acc, id) => {
          const item = data[id];
          if (item.type === 'root') acc[0].push(id);
          else if (!item.parent) acc[1].push(id);
          if (item.type === 'root' && item.startCollapsed) acc[2][id] = false;
          return acc;
        },
        [[], [], {}]
      ),
    [data]
  );

  // Create a map of expandable descendants for each root/orphan item, which is needed later.
  // Doing that here is a performance enhancement, as it avoids traversing the tree again later.
  const { expandableDescendants } = useMemo(() => {
    return [...orphanIds, ...rootIds].reduce(
      (acc, nodeId) => {
        acc.expandableDescendants[nodeId] = getDescendantIds(data, nodeId, false).filter(
          (d) => !['story', 'docs'].includes(data[d].type)
        );
        return acc;
      },
      { orphansFirst: [] as string[], expandableDescendants: {} as Record<string, string[]> }
    );
  }, [data, rootIds, orphanIds]);

  // Create a list of component IDs which should be collapsed into their (only) child.
  // That is:
  //  - components with a single story child with the same name
  //  - components with only a single docs child
  const singleStoryComponentIds = useMemo(() => {
    return Object.keys(data).filter((id) => {
      const entry = data[id];
      if (entry.type !== 'component') return false;

      const { children = [], name } = entry;
      if (children.length !== 1) return false;

      const onlyChild = data[children[0]];

      if (onlyChild.type === 'docs') return true;
      if (onlyChild.type === 'story') return isStoryHoistable(onlyChild.name, name);
      return false;
    });
  }, [data]);

  // Omit single-story components from the list of nodes.
  const collapsedItems = useMemo(
    () => Object.keys(data).filter((id) => !singleStoryComponentIds.includes(id)),

    [singleStoryComponentIds, data]
  );

  // Rewrite the dataset to place the child story in place of the component.
  const collapsedData = useMemo(() => {
    return singleStoryComponentIds.reduce(
      (acc, id) => {
        const { children, parent, name } = data[id] as ComponentEntry;
        const [childId] = children;
        if (parent) {
          const siblings = [...(data[parent] as GroupEntry).children];
          siblings[siblings.indexOf(id)] = childId;
          acc[parent] = { ...data[parent], children: siblings } as GroupEntry;
        }
        acc[childId] = {
          ...data[childId],
          name,
          parent,
          depth: data[childId].depth - 1,
        } as StoryEntry;
        return acc;
      },
      { ...data }
    );
  }, [data, singleStoryComponentIds]);

  // Track expanded nodes, keep it in sync with props and enable keyboard shortcuts.
  const [expanded, setExpanded] = useExpanded({
    refId,
    data: collapsedData,
    initialExpanded,
    rootIds,
    selectedStoryId,
    onSelectStoryId,
  });

  // Optimized: Build a simple parent map instead of full ancestry for each item
  // This is much faster than calling getAncestorIds for every item
  const parentMap = useMemo(() => {
    const map: Record<string, string | null> = {};
    collapsedItems.forEach((id) => {
      const item = collapsedData[id];
      map[id] = ('parent' in item && item.parent) || null;
    });
    return map;
  }, [collapsedItems, collapsedData]);

  // Helper function to check if all ancestors are expanded (inline traversal)
  const isItemVisible = useCallback(
    (itemId: string) => {
      const item = collapsedData[itemId];
      if (item.type === 'root') return true;
      if (!('parent' in item) || !item.parent) return true;

      // Traverse up the parent chain checking if each is expanded
      let currentId: string | null = item.parent;
      while (currentId) {
        if (!expanded[currentId]) return false;
        currentId = parentMap[currentId];
      }
      return true;
    },
    [collapsedData, expanded, parentMap]
  );

  // Convert to data array for LegendList, filtering only displayed items
  const treeData = useMemo(() => {
    return collapsedItems
      .map((itemId) => {
        const item = collapsedData[itemId];

        // Use optimized visibility check
        if (!isItemVisible(itemId)) {
          return null;
        }

        if (item.type === 'root') {
          const descendants = expandableDescendants[item.id];
          const isFullyExpanded = descendants.every((d: string) => expanded[d]);
          return {
            itemId,
            item,
            isRoot: true,
            isFullyExpanded,
            descendants,
          };
        }

        return {
          itemId,
          item,
          isRoot: false,
          isOrphan: orphanIds.some((oid) => itemId === oid || itemId.startsWith(`${oid}-`)),
        };
      })
      .filter(Boolean);
  }, [collapsedData, collapsedItems, expandableDescendants, expanded, isItemVisible, orphanIds]);

  const renderItem = useCallback(
    ({ item: treeItem }: LegendListRenderItemProps<(typeof treeData)[number]>) => {
      const { itemId, item, isRoot } = treeItem;
      const id = createId(itemId, refId);

      if (isRoot) {
        return (
          <Root
            key={id}
            item={item}
            refId={refId}
            isOrphan={false}
            isDisplayed
            isSelected={selectedStoryId === itemId}
            isExpanded={!!expanded[itemId]}
            setExpanded={setExpanded}
            isFullyExpanded={treeItem.isFullyExpanded}
            expandableDescendants={treeItem.descendants}
            onSelectStoryId={onSelectStoryId}
            docsMode={false}
            color=""
            status={{}}
          />
        );
      }

      return (
        <Node
          key={id}
          item={item}
          status={status?.[itemId]}
          refId={refId}
          color={null}
          docsMode={docsMode}
          isOrphan={treeItem.isOrphan}
          isDisplayed
          isSelected={selectedStoryId === itemId}
          isExpanded={!!expanded[itemId]}
          setExpanded={setExpanded}
          onSelectStoryId={onSelectStoryId}
        />
      );
    },
    [docsMode, expanded, onSelectStoryId, refId, selectedStoryId, setExpanded, status]
  );

  const keyExtractor = useCallback(
    (item: any) => {
      return createId(item.itemId, refId);
    },
    [refId]
  );

  const contentContainerStyle = useMemo(
    () => ({
      marginTop: isMain && orphanIds.length > 0 ? 20 : 0,
      paddingBottom: insets.bottom + 20,
      paddingLeft: 6,
    }),
    [isMain, orphanIds.length, insets.bottom]
  );

  // so we can call the scroll to function in the search component
  useLayoutEffect(() => {
    registerCallback(({ id: nextId, animated }) => {
      const targetId = nextId ?? selectedStoryId;

      const ancestorIds = getAncestorIds(collapsedData, targetId);

      setExpanded({ ids: [...ancestorIds, targetId], value: true });

      setIdToScrolllOnMount(targetId);
    });
  }, [collapsedData, registerCallback, selectedStoryId, setExpanded]);

  // a workaround for the fact that we need to expand and scroll to an item that is not in the tree yet
  useEffect(() => {
    if (idToScrolllOnMount) {
      const index = treeData.findIndex((item) => {
        return item.itemId === idToScrolllOnMount;
      });

      if (index >= 0) {
        listRef.current?.scrollToIndex({
          index,
          animated: false,
          viewPosition: 0.5,
          viewOffset: 100,
        });

        setIdToScrolllOnMount(null);
      }
    }
  }, [idToScrolllOnMount, treeData]);

  return (
    <View style={flexStyle}>
      <LegendList
        ref={listRef}
        style={flexStyle}
        data={treeData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle}
        getFixedItemSize={getEstimatedItemSize}
        keyboardShouldPersistTaps="handled"
        recycleItems
      />
    </View>
  );
});

const Root = React.memo<NodeProps & { expandableDescendants: string[] }>(function Root({
  setExpanded,
  isFullyExpanded,
  expandableDescendants,
  ...props
}) {
  const setFullyExpanded = useCallback(
    () => setExpanded({ ids: expandableDescendants, value: !isFullyExpanded }),
    [setExpanded, isFullyExpanded, expandableDescendants]
  );
  return (
    <Node
      {...props}
      setExpanded={setExpanded}
      isFullyExpanded={isFullyExpanded}
      setFullyExpanded={setFullyExpanded}
    />
  );
});
