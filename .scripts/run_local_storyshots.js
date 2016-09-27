#!/usr/bin/env node
var requireHijack = require('require-hijack');

const fakeReactDom = {
  render: () => {}
}

// Need to use a fake react dom until react version 15.4
// https://github.com/facebook/react/issues/7386
requireHijack.replace('react-dom').with(fakeReactDom);

process.env.NODE_ENV = 'development';
require('babel-core/register');
require('babel-polyfill');

require('../src/cli')
