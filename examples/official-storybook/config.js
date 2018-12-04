import React from 'react';
import ThemeProvider from '@emotion/provider';
import styled from '@emotion/styled';
import { configure, addDecorator } from '@storybook/react';
import { themes } from '@storybook/components';
import { withOptions } from '@storybook/addon-options';
import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { cssResources } from '@storybook/addon-cssresources';

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

addDecorator(cssResources);

addDecorator(
  withOptions({
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: '|',
    // theme: themes.dark,
  })
);

const Reset = styled.div(({ theme }) => ({
  fontFamily: theme.mainTextFace,
  color: theme.mainTextColor,
  WebkitFontSmoothing: 'antialiased',
  fontSize: theme.mainTextSize,
}));

addDecorator((story, { kind }) => (kind === 'Core|Errors' ? story() : <Reset>{story()}</Reset>));

addDecorator(
  (story, { kind }) =>
    kind === 'Core|Errors' ? (
      story()
    ) : (
      <ThemeProvider theme={themes.normal}>{story()}</ThemeProvider>
    )
);

configureViewport({
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
