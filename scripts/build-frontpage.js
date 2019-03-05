#!/usr/bin/env node
/* eslint-disable no-console */

const fetch = require('node-fetch');

const { CIRCLE_BRANCH, FRONTPAGE_WEBHOOK } = process.env;

console.log('build-frontpage');
if (CIRCLE_BRANCH === 'master') {
  if (FRONTPAGE_WEBHOOK) {
    console.log('triggering frontpage build');
    const url = `https://api.netlify.com/build_hooks/${FRONTPAGE_WEBHOOK}`;
    fetch(url, { method: 'post' }).then(res => console.log('result', res.status));
  } else {
    console.log('no webhook defined');
  }
} else {
  console.log('skipping branch', CIRCLE_BRANCH);
}
