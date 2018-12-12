import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import { ServerLocation } from '@reach/router';
import { ThemeProvider } from 'emotion-theming';

import { themes } from '@storybook/components';
import { mockdata } from '../../libs/nav/nav.mockdata';

import Nav from './nav';

const { dark: theme } = themes;

const props = {
  title: 'Title',
  url: 'https://example.com',
  notifications: [],
  stories: mockdata.dataset,
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
