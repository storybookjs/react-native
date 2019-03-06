import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { opacify, transparentize } from 'polished';

import { Icons } from '@storybook/components';

const Expander = styled.span(
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

  ({ isExpandable }) => (!isExpandable ? { borderLeftColor: 'transparent' } : {}),

  ({ isExpanded = false }) =>
    isExpanded
      ? {
          transform: 'rotateZ(90deg)',
        }
      : {}
);

const Icon = styled(Icons)(
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
    return {};
  },
  ({ isSelected }) => (isSelected ? { color: 'inherit' } : {})
);

export const Item = styled.div(
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
      '&& > *': theme.animation.inlineGlow,
      '&& > span': { borderColor: 'transparent' },
    }
);

export default function SidebarItem({
  name,
  depth,
  isComponent,
  isLeaf,
  isExpanded,
  isSelected,
  loading,
  ...props
}) {
  let iconName;
  if (isLeaf) {
    iconName = 'bookmarkhollow';
  } else if (isComponent) {
    iconName = 'component';
  } else {
    iconName = 'folder';
  }

  return (
    <Item isSelected={isSelected} depth={depth} loading={loading} {...props}>
      <Expander isExpandable={!isLeaf} isExpanded={isExpanded ? true : undefined} />
      <Icon icon={iconName} isSelected={isSelected} />
      <span>{name}</span>
    </Item>
  );
}

SidebarItem.propTypes = {
  name: PropTypes.node,
  depth: PropTypes.number,
  isComponent: PropTypes.bool,
  isLeaf: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isSelected: PropTypes.bool,
  loading: PropTypes.bool,
};

SidebarItem.defaultProps = {
  name: 'loading story',
  depth: 0,
  isComponent: false,
  isLeaf: false,
  isExpanded: false,
  isSelected: false,
  loading: false,
};
