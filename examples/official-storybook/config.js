import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import styled from '@emotion/styled';
import { storiesOf, configure, addDecorator, addParameters } from '@storybook/react';
import { themes } from '@storybook/components';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withCssResources } from '@storybook/addon-cssresources';
import { withA11Y } from '@storybook/addon-a11y';
import { withNotes } from '@storybook/addon-notes';

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
addDecorator(withNotes);

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

// TODO -- somehow don't use window for this cross HMR storage
const { previousExports = {} } = window; // eslint-disable-line no-undef
window.previousExports = previousExports; // eslint-disable-line no-undef

// The simplest version of examples would just export this function for users to use
function importAll(context) {
  const storyStore = window.__STORYBOOK_CLIENT_API__._storyStore; // eslint-disable-line no-undef, no-underscore-dangle

  context.keys().forEach(filename => {
    // console.log(`checking ${filename}`);
    const fileExports = context(filename);

    // A old-style story file
    if (!fileExports.default) {
      return;
    }

    const { default: component, ...examples } = fileExports;
    let componentOptions = component;
    if (component.prototype && component.prototype.isReactComponent) {
      componentOptions = { component };
    }
    const kindName = componentOptions.title || componentOptions.component.displayName;

    if (previousExports[filename]) {
      // console.log(`found previousExports ${filename}`);
      if (previousExports[filename] === fileExports) {
        // console.log(`exports have not changed ${filename}`);
        return;
      }

      // Otherwise clear this kind
      storyStore.removeStoryKind(kindName);
      storyStore.incrementRevision();
    }

    // We pass true here to avoid the warning about HMR. It's cool clientApi, we got this
    const kind = storiesOf(kindName, true);

    (componentOptions.decorators || []).forEach(decorator => {
      kind.addDecorator(decorator);
    });
    if (componentOptions.parameters) {
      kind.addParameters(componentOptions.parameters);
    }

    Object.keys(examples).forEach(key => {
      const example = examples[key];
      const { title = key, parameters } = example;
      kind.add(title, example, parameters);
    });

    previousExports[filename] = fileExports;
  });
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
