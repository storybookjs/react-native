#!/usr/bin/env node

require('babel-register')({
  ignore: /node_modules\/(?!@storybook\/cli)/,
});
require('./generate');
