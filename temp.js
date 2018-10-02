#!/usr/bin/env node --inspect-brk

const fs = require('fs');

const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');

const remark = require('remark');

remark().parse(changelog, (err, file) => {
  debugger;
  // console.log(String(file));
});
