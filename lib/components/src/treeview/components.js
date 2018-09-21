import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Heading from '../heading/heading';
import Icons from '../icon/icon';

export const Container = styled.div(({ theme }) => ({
  background: `linear-gradient(to bottom, ${theme.asideStripe}, ${
    theme.asideStripe
  } 50%, transparent 50%, transparent)`,
  backgroundSize: '100% 48px',
  marginLeft: -theme.layoutMargin * 2,
  marginRight: -theme.layoutMargin * 2,
}));
export const TreeWrapper = styled.div({});
TreeWrapper.displayName = 'TreeWrapper';

export const ListWrapper = styled.div({});
ListWrapper.displayName = 'ListWrapper';

export const A = styled.a({
  height: 24,
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
});
A.displayName = 'A';

const FilterField = styled.input(({ theme }) => ({
  height: 24,
  boxSizing: 'border-box',
  width: '100%',
  background: 'transparent',
  border: '0 none',
  color: theme.mainTextColor,
  padding: theme.layoutMargin,
  paddingLeft: 0,
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',

  '&:focus': {
    outline: 0,
    borderBottom: `1px solid ${theme.highlightColor}`,
  },
}));

// TODO: make these conponents more bare-bones and move customised components to Explorer
export class Filter extends Component {
  state = {
    placeholder: 'Press "/" to search...',
  };

  set = e => {
    this.setState({
      placeholder: e.type === 'focus' ? 'Type to search...' : 'Press "/" to search...',
    });
  };

  render() {
    const { placeholder } = this.state;
    return (
      <FilterField
        id="storybook-explorer-searchfield"
        onFocus={this.set}
        onBlur={this.set}
        {...this.props}
        placeholder={placeholder}
      />
    );
  }
}

export const LeafStyle = styled.div(
  {
    height: 24,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  ({ depth, theme }) => ({
    paddingLeft: (depth - 1) * (theme.layoutMargin * 2) + theme.layoutMargin,
  }),
  ({ isSelected, theme }) =>
    theme.asideSelected && isSelected
      ? theme.asideSelected
      : {
          background: isSelected ? '#CFD8DC' : 'transparent',
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
  }
);

export const DefaultLeaf = ({ name, ...rest }) => (
  <LeafStyle {...rest}>
    <TypeIcon icon="bookmarkhollow" />
    {name}
  </LeafStyle>
);
DefaultLeaf.displayName = 'DefaultLeaf';
DefaultLeaf.propTypes = {
  name: PropTypes.node.isRequired,
  depth: PropTypes.number.isRequired,
};
export const DefaultHead = ({ name, depth, isExpanded = true, isSelected, isComponent }) => (
  <LeafStyle isSelected={isSelected} depth={depth}>
    <RotatingChevron isRotated={isExpanded ? true : undefined} icon="play" />
    <TypeIcon icon={isComponent ? 'component' : 'folder'} />
    <span>{name}</span>
  </LeafStyle>
);
DefaultHead.displayName = 'DefaultHead';
DefaultHead.propTypes = {
  name: PropTypes.node.isRequired,
  depth: PropTypes.number.isRequired,
  isExpanded: PropTypes.bool,
  isSelected: PropTypes.bool,
  isComponent: PropTypes.bool,
};
DefaultHead.defaultProps = {
  isExpanded: false,
  isComponent: false,
  isSelected: false,
};

export const DefaultRootTitle = styled(({ children, ...rest }) => (
  <Heading {...rest}>{children}</Heading>
))({ marginTop: 20, marginBottom: 10 });

export const Link = ({ href, children, path, ...rest }) => (
  <A href={href} {...rest}>
    {children}
  </A>
);
Link.displayName = 'Link';
Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
};
