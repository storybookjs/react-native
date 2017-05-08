const shell = require('shelljs');
const chalk = require('chalk');
const packageJson = require('../package.json');

shell.echo(chalk.bold(`${packageJson.name}@${packageJson.version}`));
