import React from 'react';
import { storiesOf } from '@storybook/react';
import { ServerLocation } from '@reach/router';
import ThemeProvider from '@emotion/provider';

import { themes } from '@storybook/components';

import Nav from './nav';

const { dark: theme } = themes;

const props = {
  title: 'Title',
  url: 'https://example.com',
  notifications: [],
  stories: [
    {
      kind: 'UI|Desktop layout',
      stories: ['default', 'no Nav', 'no Panel', 'bottom Panel', 'full'],
    },
    {
      kind: 'UI|Mobile layout',
      stories: ['initial 0', 'initial 1', 'initial 2'],
    },
    {
      kind: 'UI|Nav/settings',
      stories: ['settings without brand', 'settings with brand'],
    },
    {
      kind: 'UI|Nav/components',
      stories: ['components'],
    },
    {
      kind: 'UI|Panel',
      stories: ['default', 'no panels'],
    },
  ],
  hierarchySeparator: /\/|\./,
  hierarchyRootSeparator: /\|/,
};

storiesOf('UI|Nav/settings', module)
  .addDecorator(fn => (
    <ServerLocation url="http://localhost:9011/?path=/settings">{fn()}</ServerLocation>
  ))
  .add('settings without brand', () => (
    <ThemeProvider theme={{ ...theme, brand: null }}>
      <Nav {...props} />
    </ThemeProvider>
  ))
  .add('settings with brand', () => (
    <ThemeProvider theme={{ ...theme }}>
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
