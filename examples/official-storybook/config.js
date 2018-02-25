import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import {
  configure as configureViewport,
  INITIAL_VIEWPORTS
} from '@storybook/addon-viewport';
import 'react-chromatic/storybook-addon';
import addHeadWarning from './head-warning';
import extraViewports from './extra-viewports.json';

addHeadWarning('Preview head not loaded', 'preview-head-not-loaded');
addHeadWarning('Dotenv file not loaded', 'dotenv-file-not-loaded');

setOptions({
  hierarchySeparator: /\/|\./,
  hierarchyRootSeparator: /\|/,
});

configureViewport({
  viewports: {
    ...INITIAL_VIEWPORTS,
    ...extraViewports
  }
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
