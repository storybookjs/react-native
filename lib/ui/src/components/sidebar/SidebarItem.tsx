import React from 'react';
import { styled } from '@storybook/theming';
import { opacify, transparentize } from 'polished';
import { Icons } from '@storybook/components';

export type ExpanderProps = React.ComponentProps<'span'> & {
  isExpanded?: boolean;
  isExpandable?: boolean;
};

const Expander = styled.span<ExpanderProps>(
  ({ theme }) => ({
    display: 'block',
    width: 0,
    height: 0,
    marginRight: 6,
    borderTop: '3.5px solid transparent',
    borderBottom: '3.5px solid transparent',
    borderLeft: `3.5px solid ${opacify(0.2, theme.appBorderColor)}`,
    transition: 'transform .1s ease-out',
  }),

  ({ isExpandable = false }) => (!isExpandable ? { borderLeftColor: 'transparent' } : {}),

  ({ isExpanded = false }) => {
    return isExpanded
      ? {
          transform: 'rotateZ(90deg)',
        }
      : {};
  }
);

export type IconProps = React.ComponentProps<typeof Icons> & {
  className: string; // FIXME: Icons should extended its typing from the native <svg>
  isSelected?: boolean;
};

const Icon = styled(Icons)<IconProps>(
  {
    flex: 'none',
    width: 10,
    height: 10,
    marginRight: 6,
  },
  ({ icon }) => {
    if (icon === 'folder') {
      return { color: '#774dd7' };
    }
    if (icon === 'component') {
      return { color: '#1ea7fd' };
    }
    if (icon === 'bookmarkhollow') {
      return { color: '#37d5d3' };
    }
    if (icon === 'document') {
      return { color: '#ffae00' };
    }

    return {};
  },
  ({ isSelected = false }) => (isSelected ? { color: 'inherit' } : {})
);

export const Item = styled(({ className, children, id }) => (
  <div className={className} id={id}>
    {children}
  </div>
))(
  {
    fontSize: 13,
    lineHeight: '16px',
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 20,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    background: 'transparent',
  },
  ({ depth }) => ({
    paddingLeft: depth * 15 + 9,
  }),
  ({ theme, isSelected, loading }) =>
    !loading &&
    (isSelected
      ? {
          cursor: 'default',
          background: theme.color.secondary,
          color: theme.color.lightest,
          fontWeight: theme.typography.weight.bold,
        }
      : {
          cursor: 'pointer',
          color:
            theme.base === 'light'
              ? theme.color.defaultText
              : transparentize(0.2, theme.color.defaultText),
          '&:hover': {
            color: theme.color.defaultText,
            background: theme.background.hoverable,
          },
        }),
  ({ theme, loading }) =>
    loading && {
      '&& > svg + span': { background: theme.color.medium },
      '&& > *': theme.animation.inlineGlow,
      '&& > span': { borderColor: 'transparent' },
    }
);

type SidebarItemProps = React.ComponentProps<typeof Item> & {
  isComponent?: boolean;
  isLeaf?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
};

const SidebarItem = ({
  name = 'loading story',
  isComponent = false,
  isLeaf = false,
  isExpanded = false,
  isSelected = false,
  ...props
}: SidebarItemProps) => {
  let iconName: React.ComponentProps<typeof Icons>['icon'];
  if (isLeaf && isComponent) {
    iconName = 'document';
  } else if (isLeaf) {
    iconName = 'bookmarkhollow';
  } else if (isComponent) {
    iconName = 'component';
  } else {
    iconName = 'folder';
  }

  // eslint-disable-next-line react/destructuring-assignment
  const displayName = (props.parameters && props.parameters.displayName) || name;

  return (
    <Item
      isSelected={isSelected}
      {...props}
      className={isSelected ? 'sidebar-item selected' : 'sidebar-item'}
    >
      <Expander className="sidebar-expander" isExpandable={!isLeaf} isExpanded={isExpanded} />
      <Icon className="sidebar-svg-icon" icon={iconName} isSelected={isSelected} />
      <span>{displayName}</span>
    </Item>
  );
};

export default SidebarItem;
