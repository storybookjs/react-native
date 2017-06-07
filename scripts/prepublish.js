const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');

const packageJson = require('../package.json');

shell.echo(chalk.bold(`${packageJson.name}@${packageJson.version}`));

shell.echo(chalk.gray('\n=> Clean dist.'));
shell.rm('-rf', 'dist');

const babel = path.join(__dirname, '..', 'node_modules', '.bin', 'babel');
const args = [
  '--ignore tests,__tests__,test.js,stories/,story.jsx',
  '--plugins "transform-runtime"',
  './src --out-dir ./dist',
  '--copy-files',
].join(' ');

const command = `${babel} ${args}`;
shell.echo(chalk.gray('\n=> Transpiling "src" into ES5 ...\n'));
shell.echo(chalk.gray(command));
shell.echo('');
const code = shell.exec(command).code;
if (code === 0) {
  shell.echo(chalk.gray('\n=> Transpiling completed.'));
} else {
  shell.exit(code);
}

const licence = path.join(__dirname, '..', 'LICENSE');
shell.echo(chalk.gray('\n=> Copy LICENSE.'));
shell.cp(licence, './');
