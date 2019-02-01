import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import { Popout, Icons } from '@storybook/components';
import MenuList from './MenuList';

const RoundButton = styled.button(props => ({
  height: 28,
  width: 28,
  border: '1px solid #eee',
  position: 'relative',
  borderRadius: 14,
  boxSizing: 'border-box',
  background: 'transparent',
  cursor: 'pointer',

  '.popup-content + &, &:focus': {
    border: '1px solid #00aaff',
    outline: '0 none',
    boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
  },

  ...(props.highlighted && {
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
  }),

  '& > *': {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 'calc(100% - 10px)',
    height: 'calc(100% - 10px)',
  },
}));

const Menu = ({ menuItems, highlighted }) => (
  <Popout>
    <RoundButton highlighted={highlighted}>
      <Icons icon="ellipsis" />
    </RoundButton>
    {({ hide }) => (hide ? <MenuList menuItems={menuItems} onHide={hide} /> : <div />)}
  </Popout>
);

Menu.propTypes = {
  highlighted: PropTypes.bool,
  menuItems: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
};

Menu.defaultProps = {
  highlighted: false,
};

export default Menu;
