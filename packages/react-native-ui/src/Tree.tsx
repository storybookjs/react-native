import type {
  ComponentEntry,
  GroupEntry,
  State,
  StoriesHash,
  StoryEntry,
} from 'storybook/manager-api';
import { styled } from '@storybook/react-native-theming';
import React, { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import {
  IconButton,
  ExpandAction,
  ExpandedState,
  useExpanded,
  createId,
  getAncestorIds,
  getDescendantIds,
  isStoryHoistable,
  startCase,
} from '@storybook/react-native-ui-common';
import { ComponentNode, GroupNode, StoryNode } from './TreeNode';
import { CollapseAllIcon } from './icon/CollapseAllIcon';
import { CollapseIcon } from './icon/CollapseIcon';
import { ExpandAllIcon } from './icon/ExpandAllIcon';
import type { Item } from '@storybook/react-native-ui-common';
import { useSelectedNode } from './SelectedNodeProvider';

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
  isOrphan,
  isDisplayed,
  isSelected,
  isFullyExpanded,
  color: _2,
  setFullyExpanded,
  isExpanded,
  setExpanded,
  onSelectStoryId,
}) {
  const { setNodeRef } = useSelectedNode();

  const setRef = useCallback(
    (node: View | null) => {
      if (isSelected && node) {
        setNodeRef(node);
      }
    },
    [isSelected, setNodeRef]
  );

  if (!isDisplayed) {
    return null;
  }

  const id = createId(item.id, refId);

  if (item.type === 'story') {
    return (
      <LeafNodeStyleWrapper>
        <StoryNode
          ref={setRef}
          selected={isSelected}
          key={id}
          id={id}
          depth={isOrphan ? item.depth : item.depth - 1}
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
          onPress={(event) => {
            event.preventDefault();
            setExpanded({ ids: [item.id], value: !isExpanded });
          }}
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
        depth={isOrphan ? item.depth : item.depth - 1}
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
  minHeight: 28,
  borderRadius: 4,
}));

export const RootNode = styled.View(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 16,
  marginBottom: 4,
  minHeight: 28,
}));

export const RootNodeText = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s1,
  fontWeight: theme.typography.weight.bold,
  color: theme.textMutedColor,
  lineHeight: 16,
  letterSpacing: 2.5,
  textTransform: 'uppercase',
}));

const CollapseButton = styled.TouchableOpacity(() => ({
  display: 'flex',
  flexDirection: 'row',
  paddingVertical: 0,
  paddingHorizontal: 8,
  borderRadius: 4,
  gap: 6,
  alignItems: 'center',
  cursor: 'pointer',
  height: 28,
}));

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
  const containerRef = useRef<View>(null);

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
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [singleStoryComponentIds]
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
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const ancestry = useMemo(() => {
    return collapsedItems.reduce(
      (acc, id) => Object.assign(acc, { [id]: getAncestorIds(collapsedData, id) }),
      {} as { [key: string]: string[] }
    );
  }, [collapsedItems, collapsedData]);

  // Track expanded nodes, keep it in sync with props and enable keyboard shortcuts.
  const [expanded, setExpanded] = useExpanded({
    refId,
    data: collapsedData,
    initialExpanded,
    rootIds,
    selectedStoryId,
    onSelectStoryId,
  });

  const treeItems = useMemo(() => {
    return collapsedItems.map((itemId) => {
      const item = collapsedData[itemId];
      const id = createId(itemId, refId);

      if (item.type === 'root') {
        const descendants = expandableDescendants[item.id];
        const isFullyExpanded = descendants.every((d: string) => expanded[d]);
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
            isFullyExpanded={isFullyExpanded}
            expandableDescendants={descendants}
            onSelectStoryId={onSelectStoryId}
            docsMode={false}
            color=""
            status={{}}
          />
        );
      }

      const isDisplayed = !item.parent || ancestry[itemId].every((a: string) => expanded[a]);

      return (
        <Node
          key={id}
          item={item}
          status={status?.[itemId]}
          refId={refId}
          color={null}
          docsMode={docsMode}
          isOrphan={orphanIds.some((oid) => itemId === oid || itemId.startsWith(`${oid}-`))}
          isDisplayed={isDisplayed}
          isSelected={selectedStoryId === itemId}
          isExpanded={!!expanded[itemId]}
          setExpanded={setExpanded}
          onSelectStoryId={onSelectStoryId}
        />
      );
    });
  }, [
    ancestry,
    collapsedData,
    collapsedItems,
    docsMode,
    expandableDescendants,
    expanded,
    onSelectStoryId,
    orphanIds,
    refId,
    selectedStoryId,
    setExpanded,
    status,
  ]);
  return (
    <Container ref={containerRef} hasOrphans={isMain && orphanIds.length > 0}>
      {treeItems}
    </Container>
  );
});

const Container = styled.View<{ hasOrphans: boolean }>((props) => ({
  marginTop: props.hasOrphans ? 20 : 0,
  marginBottom: 20,
}));

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
