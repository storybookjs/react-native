import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import 'react-chromatic/storybook-addon';
import addHeadWarning from './head-warning';

addHeadWarning('Preview head not loaded', 'preview-head-not-loaded');
addHeadWarning('Dotenv file not loaded', 'dotenv-file-not-loaded');

setOptions({
  hierarchySeparator: /\/|\./,
  hierarchyRootSeparator: /\|/,
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
