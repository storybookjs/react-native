import React from 'react';
import { themes, ThemeProvider } from '@storybook/theming';

import SidebarHeading from './SidebarHeading';
import * as MenuStories from '../menu/Menu.stories';

const { light: theme } = themes;

export default {
  component: SidebarHeading,
  title: 'UI|Sidebar/SidebarHeading',
};

const { menuItems } = MenuStories.simple.storyData;
export const simple = () => <SidebarHeading menu={menuItems} />;
simple.storyData = { menuItems };

export const menuHighlighted = () => <SidebarHeading menuHighlighted menu={menuItems} />;

export const customBrand = () => (
  <ThemeProvider theme={{ ...theme, brand: 'custom brand' }}>
    <SidebarHeading menu={menuItems} />
  </ThemeProvider>
);
