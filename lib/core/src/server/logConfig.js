/* eslint-disable no-console */
import chalk from 'chalk';

export function logConfig(caption, config) {
  console.log(chalk.cyan(caption));
  console.log(JSON.stringify(config, null, 2));
}
