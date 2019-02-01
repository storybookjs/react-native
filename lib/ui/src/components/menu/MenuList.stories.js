import React from 'react';

import MenuList from './MenuList';
import * as MenuItemStories from './MenuItem.stories';

const { actions } = MenuItemStories.default.storyData;
export default {
  component: MenuList,
  title: 'UI|Menu/MenuList',
  storyData: { actions },
};

const menuItems = Object.values(MenuItemStories)
  .filter(s => s.storyData && s.storyData.menuItem)
  .map(({ storyData: { menuItem } }, index) => ({
    ...menuItem,
    id: index.toString(),
  }));
export const all = () => <MenuList menuItems={menuItems} {...actions} />;
all.storyData = { menuItems };

export const single = () => <MenuList menuItems={menuItems.slice(0, 1)} {...actions} />;

export const empty = () => <MenuList menuItems={[]} {...actions} />;
