import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import styled from '@emotion/styled';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { themes } from '@storybook/components';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withCssResources } from '@storybook/addon-cssresources';
import { withA11Y } from '@storybook/addon-a11y';

import 'react-chromatic/storybook-addon';

import addHeadWarning from './head-warning';
import extraViewports from './extra-viewports.json';

if (process.env.NODE_ENV === 'development') {
  if (!process.env.DOTENV_DEVELOPMENT_DISPLAY_WARNING) {
    addHeadWarning('Dotenv development file not loaded');
  }

  if (!process.env.STORYBOOK_DISPLAY_WARNING) {
    addHeadWarning('Global storybook env var not loaded');
  }

  if (process.env.DISPLAY_WARNING) {
    addHeadWarning('Global non-storybook env var loaded');
  }
}

addHeadWarning('Preview head not loaded', 'preview-head-not-loaded');
addHeadWarning('Dotenv file not loaded', 'dotenv-file-not-loaded');

addDecorator(withCssResources);
addDecorator(withA11Y);

const Reset = styled.div(({ theme }) => ({
  fontFamily: theme.mainTextFace,
  color: theme.mainTextColor,
  WebkitFontSmoothing: 'antialiased',
  fontSize: theme.mainTextSize,
}));

addDecorator((story, { kind }) => (kind === 'Core|Errors' ? story() : <Reset>{story()}</Reset>));

addDecorator((story, { kind }) =>
  kind === 'Core|Errors' ? story() : <ThemeProvider theme={themes.normal}>{story()}</ThemeProvider>
);

addParameters({
  a11y: {},
  options: {
    name: 'Storybook',
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: '|',
    // theme: themes.dark,
  },
  viewports: {
    ...INITIAL_VIEWPORTS,
    ...extraViewports,
  },
});

function importAll(req) {
  req.keys().forEach(filename => req(filename));
}

function loadStories() {
  let req;
  req = require.context('../../lib/ui/src', true, /\.stories\.js$/);
  importAll(req);

  req = require.context('../../lib/components/src', true, /\.stories\.js$/);
  importAll(req);

  req = require.context('./stories', true, /\.stories\.js$/);
  importAll(req);
}

configure(loadStories, module);
