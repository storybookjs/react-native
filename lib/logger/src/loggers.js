import npmLog from 'npmlog';
import chalk from 'chalk';

const { console } = global;

export const nodeLogger = {
  info: message => npmLog.info('Info', message),
  warn: message => npmLog.warn('Warning', message),
  error: message => npmLog.error('Error', message),
};

export const browserLogger = {
  info: message => console.log(chalk.blue('Info ') + message),
  warn: message => console.log(chalk.yellow('Warning ') + message),
  error: message => console.log(chalk.red('Error ') + message),
};
