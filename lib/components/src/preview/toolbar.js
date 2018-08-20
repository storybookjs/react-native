import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const IconButton = styled('button')({
  width: 40,
  height: 40,
  background: 'none',
  border: '0 none',
  color: 'inherit',
});

const Side = styled('div')(
  {
    display: 'flex',
  },
  ({ flex, theme }) =>
    flex
      ? {
          flex: 1,
          borderRight: theme.mainBorder,
        }
      : {}
);

const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  height: 40,
  width: '100%',
  boxSizing: 'border-box',
  borderBottom: theme.mainBorder,
  background: theme.barFill,
  color: theme.mainTextColor,
  zIndex: 2,
  '& > *': {
    marginLeft: 20,
  },
  '& > *:first-child': {
    marginLeft: 0,
  },
}));

const Toolbar = ({ left = null, right = null }) => (
  <Wrapper>
    <Side flex>{left}</Side>
    <Side>{right}</Side>
  </Wrapper>
);
Toolbar.propTypes = {
  left: PropTypes.node.isRequired,
  right: PropTypes.node.isRequired,
};

export { Toolbar, IconButton };
