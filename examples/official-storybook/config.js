/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import 'react-chromatic/storybook-addon';
import addHeadWarning from './head-warning';

addHeadWarning('Preview');

setOptions({
  hierarchySeparator: /\/|\./,
  hierarchyRootSeparator: /\|/,
});

function loadStories() {
  let req;
  req = require.context('../../lib/ui/src', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));

  req = require.context('../../lib/components/src', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));

  req = require.context('./stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
