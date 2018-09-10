import program from 'commander';
import pkg from '../package.json';
import initiate from '../lib/initiate';

program
  .command('init')
  .description('Initialize Storybook into your project.')
  .option('-f --force', 'Forcely add storybook')
  .option('-s --skip-install', 'Skip installing deps')
  .option('-N --use-npm', 'Use npm to install deps')
  .option('-p --parser <babel | babylon | flow>', 'jscodeshift parser')
  .option('-h --html', 'Add storybook for HTML')
  .action(options => initiate(options, pkg));

program.command('*', { noHelp: true }).action(cmd => {
  console.error('Invalid command: %s.\nSee --help for a list of available commands.', cmd);
  process.exit(1);
});

program.version(pkg.version).parse(process.argv);

if (!program.args.length) {
  program.help();
}
