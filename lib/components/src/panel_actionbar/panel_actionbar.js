import React, { Children } from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';

const Container = styled.ul(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  maxWidth: '100%',
  display: 'flex',
  listStyle: 'none',
  margin: 0,
  padding: 0,

  borderTop: theme.mainBorder,
  borderLeft: theme.mainBorder,
  background: theme.barFill,
  borderRadius: `${theme.mainBorderRadius}px 0 0 0`,
}));

export const ActionButton = styled.button(({ theme }) => ({
  border: '0 none',
  display: 'block',
  background: 'none',
  padding: '0 10px',

  textTransform: 'inherit',
  letterSpacing: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',

  borderTop: '2px solid transparent',
  borderBottom: '2px solid transparent',

  '&:focus': {
    borderBottom: `2px solid ${theme.highlightColor}`,
    outline: '0 none',
  },
}));
ActionButton.displayName = 'ActionButton';

export const ActionItem = styled.li(({ first, theme }) => ({
  display: 'flex',
  position: 'relative',
  listStyle: 'none',
  padding: 0,
  height: 26,
  fontSize: 11,
  letterSpacing: 1,
  textTransform: 'uppercase',

  borderLeft: first ? '0 none' : `1px solid ${theme.mainBorderColor}`,
}));
ActionItem.displayName = 'ActionItem';

export const ActionBar = ({ children }) => (
  <Container>
    {Children.toArray(children).map((item, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ActionItem key={index} first={index === 0}>
        {item}
      </ActionItem>
    ))}
  </Container>
);

ActionBar.propTypes = {
  children: PropTypes.node.isRequired,
};
