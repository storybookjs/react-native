import program from 'commander';
import pkg from '../package.json';
import initiate from '../lib/initiate';
import yarnSpawnSync from '../lib/yarn_spawn_sync';

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
  .description('Start the Storybook server')
  .option('-N --use-npm', 'Use NPM to start the Storybook server')
  .action(options => yarnSpawnSync(options, ['run', 'storybook']));

program
  .command('build')
  .description('Build the Storybook server')
  .option('-N --use-npm', 'Use NPM to build the Storybook server')
  .action(options => yarnSpawnSync(options, ['build', 'storybook']));

program.command('*', { noHelp: true }).action(cmd => {
  console.error('Invalid command: %s.\nSee --help for a list of available commands.', cmd);
  process.exit(1);
});

program.version(pkg.version).parse(process.argv);

if (!program.args.length) {
  program.help();
}
