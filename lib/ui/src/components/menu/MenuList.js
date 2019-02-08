import React from 'react';
import PropTypes from 'prop-types';
import { List } from '@storybook/components';

import MenuItem from './MenuItem';

const MenuList = React.memo(({ menuItems, onHide }) => (
  <List>
    {menuItems.map(menuItem => (
      <MenuItem key={menuItem.id} menuItem={menuItem} onHide={onHide} />
    ))}
  </List>
));
MenuList.displayName = 'MenuList';

MenuList.propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  onHide: PropTypes.func.isRequired,
};

export default MenuList;
