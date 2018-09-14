import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Item, Icon, Title, Detail, List, Popout, Icons } from '@storybook/components';

export const Menu = ({ items }) =>
  items ? (
    <List>
      {items.map(m => (
        <Item key={m.id} onClick={m.action}>
          <Icon type={m.icon} />
          <Title>{m.title}</Title>
          {typeof m.detail === 'string' ? <Detail>{m.detail}</Detail> : m.detail}
        </Item>
      ))}
    </List>
  ) : null;
Menu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
      actions: PropTypes.func.isRequired,
      detail: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
      icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    })
  ).isRequired,
};

const RoundButton = styled.button({
  height: 28,
  width: 28,
  border: '1px soli #eee',
  position: 'relative',
  borderRadius: 14,
  boxSizing: 'border-box',
  background: 'transparent',

  '.popup-content + &, &:focus': {
    border: '1px solid #00aaff',
    outline: '0 none',
    boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
  },

  '&:after': {
    content: '""',
    position: 'absolute',
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    background: '#66bf3c',
  },

  '& > *': {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 'calc(100% - 10px)',
    height: 'calc(100% - 10px)',
  },
});

export const MenuToggle = ({ children }) => (
  <Popout
    trigger={props => (
      <RoundButton {...props}>
        <Icons.More />
      </RoundButton>
    )}
  >
    {children}
  </Popout>
);
