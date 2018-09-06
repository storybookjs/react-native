import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import { Link } from '../../router';

export const Bar = styled.ul(({ theme }) => ({
  display: 'flex',
  margin: 0,
  padding: 0,
  borderRadius: theme.mainBorderRadius,
  overflow: 'hidden',
  background: theme.barFill,
  justifyContent: 'space-between',
  height: 40,
  marginTop: 20,
}));

const BarLi = styled.li(({ active, theme }) => ({
  display: 'block',
  margin: 0,
  padding: 0,
  flex: 1,
  background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
  borderTop: '2px solid transparent',
  borderBottom: active ? `2px solid ${theme.highlightColor}` : '2px solid transparent',

  '& > a': {
    cursor: 'pointer',
    color: 'inherit',
    display: 'block',
    padding: 10,
    textAlign: 'center',
  },
}));

export const BarItem = ({ path, children, active }) => (
  <BarLi active={active}>
    <Link to={path}>{children}</Link>
  </BarLi>
);
BarItem.propTypes = {
  path: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool.isRequired,
};
