import React from 'react';
import { themes, ThemeProvider } from '@storybook/theming';
import { action } from '@storybook/addon-actions';

import SidebarHeading from './SidebarHeading';

const { light: theme } = themes;

export default {
  component: SidebarHeading,
  title: 'UI|Sidebar/SidebarHeading',
  decorators: [
    storyFn => (
      <div
        style={{
          width: '240px',
          margin: '1rem',
        }}
      >
        {storyFn()}
      </div>
    ),
  ],
};

const menuItems = [
  { title: 'Menu Item 1', onClick: action('onActivateMenuItem') },
  { title: 'Menu Item 2', onClick: action('onActivateMenuItem') },
  { title: 'Menu Item 3', onClick: action('onActivateMenuItem') },
];
export const simple = () => <SidebarHeading menu={menuItems} />;
simple.storyData = { menu: menuItems };

export const menuHighlighted = () => <SidebarHeading menuHighlighted menu={menuItems} />;

export const customTitle = () => (
  <ThemeProvider theme={{ ...theme, brand: { title: 'Custom title' } }}>
    <SidebarHeading menu={menuItems} />
  </ThemeProvider>
);

export const customTitleAndUrl = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: { title: 'Custom title & link', url: 'https://storybook.js.org' },
    }}
  >
    <SidebarHeading menu={menuItems} />
  </ThemeProvider>
);

export const customBrandComponent = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: 'Your Storybook',
        url: 'https://storybook.js.org',
        component: () => <a href="/yoursite">Custom component</a>,
      },
    }}
  >
    <SidebarHeading menu={menuItems} />
  </ThemeProvider>
);
