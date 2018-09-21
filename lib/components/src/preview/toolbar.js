import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

export const Separator = styled.span({
  width: 1,
  height: 24,
  background: '#eee',
  marginTop: 8,
});

const IconButton = styled.button(
  {
    height: 40,
    background: 'none',
    color: 'inherit',
    padding: 0,

    border: '0 solid transparent',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',

    '&:hover, &:focus': {
      outline: '0 none',
      color: '#00aaff',
    },
  },
  ({ active, theme }) =>
    active
      ? {
          outline: '0 none',
          borderBottomColor: theme.highlightColor,
        }
      : {}
);

const Side = styled.div(
  {
    display: 'flex',

    '& > *': {
      marginRight: 15,
    },
  },
  ({ flex }) =>
    flex
      ? {
          flex: 1,
        }
      : {}
);

const Wrapper = styled.div(({ theme }) => ({
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
  color: '#999999',
  zIndex: 4,
  overflow: 'auto',
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
