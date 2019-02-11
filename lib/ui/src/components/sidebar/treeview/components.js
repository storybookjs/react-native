import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

export const DefaultSection = styled.div({});
DefaultSection.displayName = 'DefaultSection';

export const DefaultList = styled.div();
DefaultList.displayName = 'DefaultList';

export const A = styled.a({});
A.displayName = 'A';

export const DefaultFilter = styled(props => <input placeholder="search..." {...props} />)({
  width: '100%',
  background: 'transparent',
  border: '1px solid black',
});

export const DefaultMessage = styled.div({});

export const LeafStyle = styled.div(
  {
    minHeight: 24,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  ({ depth }) => ({
    paddingLeft: depth * 10,
  }),
  ({ isSelected }) => ({
    background: isSelected ? '#CFD8DC' : 'transparent',
  })
);

export const DefaultLeaf = ({ name, ...rest }) => <LeafStyle {...rest}>{name}</LeafStyle>;
DefaultLeaf.displayName = 'DefaultLeaf';
DefaultLeaf.propTypes = {
  name: PropTypes.node.isRequired,
  depth: PropTypes.number.isRequired,
};
export const DefaultHead = ({ name, depth, isExpanded = true, isSelected, isComponent }) => (
  <LeafStyle isSelected={isSelected} depth={depth}>
    <span>
      {isExpanded ? '-' : '+'}
      {isComponent ? '!' : ''}
    </span>
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

export const DefaultRootTitle = styled.h4({});

export const DefaultLink = ({ id, prefix, children, ...rest }) => (
  <A href={`#!${prefix}${id}`} {...rest} onClick={e => e.preventDefault() || rest.onClick(e)}>
    {children}
  </A>
);
DefaultLink.displayName = 'DefaultLink';
DefaultLink.propTypes = {
  id: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
