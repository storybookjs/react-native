import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import { Typography, Icons } from '@storybook/components';
import { Location, Link as RouterLink } from '@storybook/router';

export const Section = styled.section({});

export const List = styled.div();
List.displayName = 'List';

export const A = styled.a({
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
});
A.displayName = 'A';

const UnstyledRouterLink = styled(RouterLink)({
  color: 'inherit',
  textDecoration: 'none',
  display: 'block',
});

export const Link = ({ id, prefix, children, ...rest }) => (
  <Location>
    {({ viewMode }) => (
      <UnstyledRouterLink to={`/${viewMode || 'story'}/${id}`} {...rest}>
        {children}
      </UnstyledRouterLink>
    )}
  </Location>
);
Link.displayName = 'Link';
Link.propTypes = {
  id: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const StyledLeaf = styled.div(
  ({ theme }) => ({
    marginLeft: -theme.layoutMargin * 2,
    marginRight: -theme.layoutMargin * 2,
  }),
  {
    minHeight: 24,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    textDecoration: 'none',
  },
  ({ depth, theme }) => ({
    paddingLeft: depth * (theme.layoutMargin * 2) + theme.layoutMargin,
  }),
  ({ theme, isSelected }) =>
    isSelected
      ? {}
      : {
          '&:hover': theme.asideHover || {},
        },
  ({ isSelected, theme }) =>
    theme.asideSelected && isSelected
      ? theme.asideSelected
      : {
          background: isSelected ? theme.color.secondary : 'transparent',
        }
);

const RotatingChevron = styled(Icons)(
  ({ theme }) => ({
    display: 'inline-block',
    width: 8,
    height: 8,
    margin: 1,
    marginRight: 4,
    marginLeft: -2,
    transition: 'transform .1s linear',
    color: theme.dimmedTextColor,
  }),
  ({ isRotated = false }) =>
    isRotated
      ? {
          transform: 'rotateZ(90deg)',
        }
      : {}
);

const TypeIcon = styled(Icons)(
  ({ theme }) => ({
    display: 'inline-block',
    width: 10,
    height: 10,
    marginRight: theme.layoutMargin,
  }),
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

StyledLeaf.displayName = 'StyledLeaf';

export const Leaf = ({ name, isSelected, ...rest }) => (
  <StyledLeaf {...rest} isSelected={isSelected}>
    <TypeIcon icon="bookmarkhollow" isSelected={isSelected} />
    {name}
  </StyledLeaf>
);
Leaf.displayName = 'Leaf';
Leaf.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  name: PropTypes.node.isRequired,
  depth: PropTypes.number.isRequired,
};

export const StyledHead = styled.div(
  ({ theme }) => ({
    marginLeft: -theme.layoutMargin * 2,
    marginRight: -theme.layoutMargin * 2,
  }),
  {
    minHeight: 24,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  ({ depth, theme }) => ({
    paddingLeft: depth * (theme.layoutMargin * 2) + theme.layoutMargin,
  }),
  ({ theme, isSelected }) =>
    isSelected
      ? {}
      : {
          '&:hover': theme.asideHover || {},
        },
  ({ isSelected, theme }) =>
    theme.asideSelected && isSelected
      ? theme.asideSelected
      : {
          background: isSelected ? '#CFD8DC' : 'transparent',
        }
);

export const Head = ({ name, depth, isExpanded = true, isSelected, isComponent }) => (
  <StyledHead isSelected={isSelected} depth={depth}>
    <RotatingChevron isRotated={isExpanded ? true : undefined} icon="play" />
    <TypeIcon icon={isComponent ? 'component' : 'folder'} />
    <span>{name}</span>
  </StyledHead>
);
Head.displayName = 'Head';
Head.propTypes = {
  name: PropTypes.node.isRequired,
  depth: PropTypes.number.isRequired,
  isExpanded: PropTypes.bool,
  isSelected: PropTypes.bool,
  isComponent: PropTypes.bool,
};
Head.defaultProps = {
  isExpanded: false,
  isComponent: false,
  isSelected: false,
};

export const Title = styled(({ children, ...rest }) => (
  <Typography.Heading {...rest}>{children}</Typography.Heading>
))(({ theme }) => ({
  marginBottom: theme.layoutMargin,
}));
Title.propTypes = {
  children: PropTypes.node.isRequired,
};
