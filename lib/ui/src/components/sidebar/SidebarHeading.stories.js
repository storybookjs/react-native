import React from 'react';
import { themes, ThemeProvider, convert } from '@storybook/theming';
import { action } from '@storybook/addon-actions';

import SidebarHeading from './SidebarHeading';

const { light } = themes;
const theme = convert(light);

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

export const menuHighlighted = () => <SidebarHeading menuHighlighted menu={menuItems} />;

export const standard = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: undefined,
        url: undefined,
        image: undefined,
      },
    }}
  >
    <SidebarHeading menu={menuItems} />
  </ThemeProvider>
);
standard.storyData = { menu: menuItems };

export const standardNoLink = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: undefined,
        url: null,
        image: undefined,
      },
    }}
  >
    <SidebarHeading menu={menuItems} />
  </ThemeProvider>
);

export const linkAndText = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: 'My title',
        url: 'https://example.com',
        image: null,
      },
    }}
  >
    <SidebarHeading menu={menuItems} />
  </ThemeProvider>
);

export const onlyText = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: 'My title',
        url: null,
        image: null,
      },
    }}
  >
    <SidebarHeading menu={menuItems} />
  </ThemeProvider>
);

export const longText = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: 'My title is way to long to actually fit',
        url: null,
        image: null,
      },
    }}
  >
    <SidebarHeading menu={menuItems} />
  </ThemeProvider>
);

export const customBrandImage = () => (
  <ThemeProvider
    theme={{
      ...theme,
      brand: {
        title: 'My Title',
        url: 'https://example.com',
        image: 'https://via.placeholder.com/150x22',
      },
    }}
  >
    <SidebarHeading menu={menuItems} />
  </ThemeProvider>
);
