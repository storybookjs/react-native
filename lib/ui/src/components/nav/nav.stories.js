import React from 'react';
import { storiesOf } from '@storybook/react';
import { ServerLocation } from '@reach/router';

import { themes, ThemeProvider } from '@storybook/theming';

import Nav from './nav';

const { dark: theme } = themes;

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
  ));

storiesOf('UI|Nav/story', module)
  .addDecorator(fn => (
    <ServerLocation url="http://localhost:9011/?path=/story/UI-MobileLayout-initial0">
      {fn()}
    </ServerLocation>
  ))
  .add('story', () => <Nav {...props} />);
