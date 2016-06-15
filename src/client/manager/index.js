import 'es6-shim';
import renderManagerUI from '@kadira/storybook-core';
import Provider from './provider';

var rootEl = document.getElementById('root');
renderManagerUI(rootEl, new Provider());
