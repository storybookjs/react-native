/* eslint-disable no-console */
const shell = require('shelljs');

// exit with code 1 if there are some changed files
if (shell.exec('git status --porcelain').stdout.trim() !== '') {
  console.error(
    'Git repo is dirty, please consider updating lockfiles by running `yarn bootstrap --core --docs`'
  );
  process.exit(1);
}
