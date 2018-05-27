import React, { Children } from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

const Container = styled('ul')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  display: 'flex',
  listStyle: 'none',
  margin: 0,
  padding: 0,

  borderTop: theme.mainBorder,
  borderLeft: theme.mainBorder,
  background: theme.barFill,
  borderRadius: `${theme.mainBorderRadius}px 0 0 0`,
}));

export const ActionButton = styled('button')({
  border: '0 none',
  display: 'block',
  background: 'none',
  padding: '0 10px',
  textTransform: 'uppercase',
  letterSpacing: 1,
});

export const ActionItem = styled('li')(({ first, theme }) => ({
  display: 'flex',
  listStyle: 'none',
  padding: 0,
  height: 26,
  borderLeft: first ? '0 none' : `1px solid ${theme.mainBorderColor}`,
}));

export const ActionBar = ({ children }) => (
  <Container>
    {Children.toArray(children).map((item, index, list) => (
      <ActionItem first={index === 0} last={list.length - 1 === index}>
        {item}
      </ActionItem>
    ))}
  </Container>
);

ActionBar.propTypes = {
  children: PropTypes.node.isRequired,
};
