const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const babel = ['node_modules', '.bin', 'babel'].join(path.sep);

require('./ver');


const args = [
  '--ignore tests,__tests__,stories,story.jsx,story.js',
  '--plugins "transform-runtime"',
  './src --out-dir ./dist',
].join(' ');

const cmd = `${babel} ${args}`;
shell.rm('-rf', 'dist');

shell.echo(chalk.gray('\n=> Transpiling \'src\' into ES5 ...\n'));
shell.echo(chalk.gray(cmd));
shell.echo('');
shell.exec(cmd);
shell.echo(chalk.gray('\n=> Transpiling completed.'));
