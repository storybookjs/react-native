#!/usr/bin/env node
const path = require('path');

require('@babel/register')({
  // see https://github.com/babel/babel/issues/7701#issuecomment-389720069
  cwd: path.resolve(__dirname, '..'),
  only: [/(@storybook|lib)\/cli/],
});
require('./generate');
