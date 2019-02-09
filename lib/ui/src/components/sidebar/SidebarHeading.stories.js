import React from 'react';
import { themes, ThemeProvider } from '@storybook/theming';
import { action } from '@storybook/addon-actions';

import SidebarHeading from './SidebarHeading';

const { light: theme } = themes;

export default {
  component: SidebarHeading,
  title: 'UI|Sidebar/SidebarHeading',
};

const menuItems = [
  { title: 'Menu Item 1', onClick: action('onActivateMenuItem') },
  { title: 'Menu Item 2', onClick: action('onActivateMenuItem') },
  { title: 'Menu Item 3', onClick: action('onActivateMenuItem') },
];
export const simple = () => <SidebarHeading menu={menuItems} />;
simple.storyData = { menu: menuItems };

export const menuHighlighted = () => <SidebarHeading menuHighlighted menu={menuItems} />;

export const customBrand = () => (
  <ThemeProvider theme={{ ...theme, brand: 'custom brand' }}>
    <SidebarHeading menu={menuItems} />
  </ThemeProvider>
);
