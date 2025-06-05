import { styled, useTheme } from '@storybook/react-native-theming';
import { ComponentIcon } from './icon/ComponentIcon';
import { GroupIcon } from './icon/GroupIcon';
import { StoryIcon } from './icon/StoryIcon';
import { CollapseIcon } from './icon/CollapseIcon';
import React, { ComponentProps, FC, forwardRef, useMemo } from 'react';
import { transparentize } from 'polished';
import { View } from 'react-native';

export interface NodeProps {
  children: React.ReactNode | React.ReactNode[];
  isExpandable?: boolean;
  isExpanded?: boolean;
}

const BranchNodeText = styled.Text<{ isSelected?: boolean }>(({ theme }) => ({
  textAlign: 'left',
  fontSize: theme.typography.size.s2,
  flexShrink: 1,
  color: theme.color.defaultText,
}));

const BranchNode = styled.TouchableOpacity<{
  depth?: number;
  isExpandable?: boolean;
  isExpanded?: boolean;
  isComponent?: boolean;
  isSelected?: boolean;
}>(({ depth = 0, isExpandable = false, theme }) => ({
  width: '100%',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  alignSelf: 'flex-start',
  paddingLeft: (isExpandable ? 8 : 22) + depth * 18,

  backgroundColor: 'transparent',
  minHeight: 28,
  borderRadius: 4,
  gap: 6,
  paddingTop: 5,
  paddingBottom: 4,

  // will this actually do anything?
  '&:hover, &:focus': {
    backgroundColor: transparentize(0.93, theme.color.secondary),
    outline: 'none',
  },
}));

const LeafNode = styled.TouchableOpacity<{ depth?: number; selected?: boolean }>(
  ({ depth = 0, selected, theme }) => ({
    alignSelf: 'flex-start',
    cursor: 'pointer',
    color: 'inherit',
    display: 'flex',
    gap: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 22 + depth * 18,
    paddingTop: 5,
    paddingBottom: 4,
    backgroundColor: selected ? theme.color.secondary : undefined,
    // not sure 👇
    width: '100%',
    borderRadius: 4,
    paddingRight: 20,
    minHeight: 28,
  })
);

const LeafNodeText = styled.Text<{ depth?: number; selected?: boolean }>(({ theme, selected }) => ({
  fontSize: theme.typography.size.s2,
  flexShrink: 1,
  fontWeight: selected ? 'bold' : 'normal',
  color: selected ? theme.color.lightest : theme.color.defaultText,
}));

const Wrapper = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  marginTop: 2,
});

export const GroupNode: FC<
  ComponentProps<typeof BranchNode> & { isExpanded?: boolean; isExpandable?: boolean }
> = React.memo(function GroupNode({
  children,
  isExpanded = false,
  isExpandable = false,
  ...props
}) {
  const theme = useTheme();

  const color = useMemo(() => {
    return theme.base === 'dark' ? theme.color.primary : theme.color.ultraviolet;
  }, [theme.base, theme.color.primary, theme.color.ultraviolet]);

  return (
    <BranchNode isExpandable={isExpandable} {...props}>
      <Wrapper>
        {isExpandable && <CollapseIcon isExpanded={isExpanded} />}
        <GroupIcon width={14} height={14} color={color} />
      </Wrapper>
      <BranchNodeText>{children}</BranchNodeText>
    </BranchNode>
  );
});

export const ComponentNode: FC<ComponentProps<typeof BranchNode>> = React.memo(
  function ComponentNode({ children, isExpanded, isExpandable, ...props }) {
    const theme = useTheme();

    const color = useMemo(() => {
      return theme.color.secondary;
    }, [theme.color.secondary]);

    return (
      <BranchNode isExpandable={isExpandable} {...props}>
        <Wrapper>
          {isExpandable && <CollapseIcon isExpanded={isExpanded} />}
          <ComponentIcon width={12} height={12} color={color} />
        </Wrapper>
        <BranchNodeText>{children}</BranchNodeText>
      </BranchNode>
    );
  }
);

export const StoryNode = React.memo(
  forwardRef<View, ComponentProps<typeof LeafNode>>(function StoryNode(
    { children, ...props },
    ref
  ) {
    const theme = useTheme();

    const color = useMemo(() => {
      return props.selected ? theme.color.lightest : theme.color.seafoam;
    }, [props.selected, theme.color.lightest, theme.color.seafoam]);

    return (
      <LeafNode {...props} ref={ref}>
        <Wrapper>
          <StoryIcon width={14} height={14} color={color} />
        </Wrapper>
        <LeafNodeText selected={props.selected}>{children}</LeafNodeText>
      </LeafNode>
    );
  })
);

StoryNode.displayName = 'StoryNode';
