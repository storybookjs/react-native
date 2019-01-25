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

storiesOf('UI|Nav/settings', module)
  .addDecorator(fn => (
    <ServerLocation url="http://localhost:9011/?path=/settings">{fn()}</ServerLocation>
  ))
  .add('with brand', () => (
    <ThemeProvider theme={{ ...theme }}>
      <Nav {...props} />
    </ThemeProvider>
  ))
  .add('without brand', () => (
    <ThemeProvider theme={{ ...theme, brand: null }}>
      <Nav {...props} />
    </ThemeProvider>
  ))
  .add('with Root', () => (
    <ThemeProvider theme={{ ...theme, brand: null }}>
      <Nav {...props} stories={mockDataset.withRoot} />
    </ThemeProvider>
  ))
  .add('without Root', () => (
    <ThemeProvider theme={{ ...theme, brand: null }}>
      <Nav {...props} stories={mockDataset.noRoot} />
    </ThemeProvider>
  ));

storiesOf('UI|Nav/story', module)
  .addDecorator(fn => (
    <ServerLocation url="http://localhost:9011/?path=/story/UI-MobileLayout-initial0">
      {fn()}
    </ServerLocation>
  ))
  .add('story', () => <Nav {...props} />);
