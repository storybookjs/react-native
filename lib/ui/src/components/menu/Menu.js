import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import { Popout, Button, Icons } from '@storybook/components';
import MenuList from './MenuList';

const MenuButton = styled(Button)(props => ({
  position: 'relative',
  overflow: 'visible',

  ...(props.highlighted && {
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      background: `${props.theme.color.positive}`,
    },
  }),
}));

const Menu = ({ menuItems, highlighted }) => (
  <Popout>
    <MenuButton outline small containsIcon highlighted={highlighted}>
      <Icons icon="ellipsis" />
    </MenuButton>
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
