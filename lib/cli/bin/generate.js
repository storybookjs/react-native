import program from 'commander';
import chalk from 'chalk';
import pkg from '../package.json';
import initiate from '../lib/initiate';
import yarnSpawnSync from '../lib/yarn_spawn_sync';
import { codeLog } from '../lib/helpers';

const logger = console;

if (process.argv[1].includes('getstorybook')) {
  logger.log(chalk.yellow('WARNING: getstorybook is deprecated.'));
  logger.log(chalk.yellow('To install storybook, use the following command instead:\n'));
  codeLog(['storybook init']);
  logger.log();
  process.exit(0);
}

program
  .command('init')
  .description('Initialize Storybook into your project.')
  .option('-f --force', 'Forcely add storybook')
  .option('-s --skip-install', 'Skip installing deps')
  .option('-N --use-npm', 'Use npm to install deps')
  .option('-p --parser <babel | babylon | flow>', 'jscodeshift parser')
  .option('-h --html', 'Add storybook for HTML')
  .action(options => initiate(options, pkg));

program
  .command('start')
  .description('Start the local Storybook server')
  .option('-N --use-npm', 'Use NPM to start the Storybook server')
  .action(options => yarnSpawnSync(options, ['run', 'storybook']));

program
  .command('build')
  .description('Build the Storybook static application')
  .option('-N --use-npm', 'Use NPM to build the Storybook server')
  .action(options => yarnSpawnSync(options, ['build', 'storybook']));

program.command('*', { noHelp: true }).action(cmd => {
  logger.error('Invalid command: %s.\nSee --help for a list of available commands.', cmd);
  process.exit(1);
});

program.version(pkg.version).parse(process.argv);

if (!program.args.length) {
  program.help();
}
