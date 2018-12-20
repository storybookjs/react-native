import React from 'react';
import { storiesOf } from '@storybook/react';
import { ServerLocation } from '@reach/router';
import { ThemeProvider } from 'emotion-theming';

import { themes } from '@storybook/components';

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

storiesOf('UI|Nav/components', module)
  .addDecorator(fn => (
    <ServerLocation url="http://localhost:9011/?path=/components/UI-MobileLayout-initial0">
      {fn()}
    </ServerLocation>
  ))
  .add('components', () => <Nav {...props} />);
