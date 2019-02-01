import React from 'react';

import Menu from './Menu';
import * as MenuListStories from './MenuList.stories';

export default {
  component: Menu,
  title: 'UI|Menu/Menu',
};

const { menuItems } = MenuListStories.all.storyData;
export const simple = () => <Menu menuItems={menuItems} />;
simple.storyData = { menuItems };

export const highlighted = () => <Menu highlighted menuItems={menuItems} />;
