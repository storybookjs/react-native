const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const babel = path.join('node_modules', '.bin', 'babel');

require('./ver');


const args = [
  '--ignore tests,__tests__,test.js,stories/,story.jsx,story.js',
  '--plugins "transform-runtime"',
  './src --out-dir ./dist',
  '--copy-files',
].join(' ');

const cmd = `${babel} ${args}`;
shell.rm('-rf', 'dist');

shell.echo(chalk.gray('\n=> Transpiling \'src\' into ES5 ...\n'));
shell.echo(chalk.gray(cmd));
shell.echo('');
shell.exec(cmd);
shell.echo(chalk.gray('\n=> Transpiling completed.'));
