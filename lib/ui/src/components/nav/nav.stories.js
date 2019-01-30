import React from 'react';
import { storiesOf } from '@storybook/react';
import { ServerLocation } from '@reach/router';

import { themes, ThemeProvider } from '@storybook/theming';

import Nav from './nav';

import { mockDataset } from './treeview.mockdata';

const { light: theme } = themes;

const props = {
  title: 'Title',
  url: 'https://example.com',
  notifications: [],
  stories: {},
};

storiesOf('UI|Nav', module)
  .addDecorator(fn => (
    <ServerLocation url="http://localhost:9011/?path=/settings">{fn()}</ServerLocation>
  ))
  .add('default', () => (
    <ThemeProvider theme={{ ...theme, brand: null }}>
      <Nav {...props} />
    </ThemeProvider>
  ))
  .add('with custom brand', () => (
    <ThemeProvider theme={{ ...theme, brand: 'custom brand' }}>
      <Nav {...props} />
    </ThemeProvider>
  ))
  .add('with treeview root', () => (
    <ThemeProvider theme={{ ...theme }}>
      <Nav {...props} stories={mockDataset.withRoot} />
    </ThemeProvider>
  ))
  .add('without treeview root', () => (
    <ThemeProvider theme={{ ...theme }}>
      <Nav {...props} stories={mockDataset.noRoot} />
    </ThemeProvider>
  ));
