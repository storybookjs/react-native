import React from 'react';
import { load, addDecorator, addParameters } from '@storybook/react';
import { Global, ThemeProvider, themes, createReset, convert } from '@storybook/theming';
import { DocsPage } from '@storybook/addon-docs/blocks';

import { withCssResources } from '@storybook/addon-cssresources';
import { withA11y } from '@storybook/addon-a11y';
import { withNotes } from '@storybook/addon-notes';

import 'storybook-chromatic';

import addHeadWarning from './head-warning';

if (process.env.NODE_ENV === 'development') {
  if (!process.env.DOTENV_DEVELOPMENT_DISPLAY_WARNING) {
    addHeadWarning('dotenv-env', 'Dotenv development file not loaded');
  }

  if (!process.env.STORYBOOK_DISPLAY_WARNING) {
    addHeadWarning('env-glob', 'Global storybook env var not loaded');
  }

  if (process.env.DISPLAY_WARNING) {
    addHeadWarning('env-extra', 'Global non-storybook env var loaded');
  }
}

addHeadWarning('preview-head-not-loaded', 'Preview head not loaded');
addHeadWarning('dotenv-file-not-loaded', 'Dotenv file not loaded');

addDecorator(withCssResources);
addDecorator(withA11y);
addDecorator(withNotes);

addDecorator(storyFn => (
  <ThemeProvider theme={convert(themes.light)}>
    <Global styles={createReset} />
    {storyFn()}
  </ThemeProvider>
));

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  options: {
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: '|',
    theme: themes.light, // { base: 'dark', brandTitle: 'Storybook!' },
  },
  backgrounds: [
    { name: 'storybook app', value: themes.light.appBg, default: true },
    { name: 'light', value: '#eeeeee' },
    { name: 'dark', value: '#222222' },
  ],
  docs: DocsPage,
});

load(
  [
    require.context('../../lib/ui/src', true, /\.stories\.(js|tsx?|mdx)$/),
    require.context('../../lib/components/src', true, /\.stories\.(js|tsx?|mdx)$/),
    require.context('./stories', true, /\.stories\.(js|tsx?|mdx)$/),
  ],
  module
);
