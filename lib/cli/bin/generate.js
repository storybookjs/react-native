import program from 'commander';
import chalk from 'chalk';
import envinfo from 'envinfo';
import didYouMean from 'didyoumean';
import pkg from '../package.json';
import initiate from '../lib/initiate';
import { codeLog } from '../lib/helpers';
import add from '../lib/add';
import { migrate } from '../lib/migrate';

const logger = console;

if (process.argv[1].includes('getstorybook')) {
  logger.log(chalk.yellow('WARNING: getstorybook is deprecated.'));
  logger.log(chalk.yellow('The official command to install Storybook from now on is:\n'));
  codeLog(['sb init']);
  logger.log();
  initiate({}, pkg).then(() => process.exit(0));
} else {
  program
    .command('init')
    .description('Initialize Storybook into your project.')
    .option('-f --force', 'Force add storybook')
    .option('-s --skip-install', 'Skip installing deps')
    .option('-N --use-npm', 'Use npm to install deps')
    .option('-p --parser <babel | babylon | flow | ts | tsx>', 'jscodeshift parser')
    .option('-t --type <type>', 'Add Storybook for a specific project type')
    .option('--story-format <csf | csf-ts | mdx >', 'Generate stories in a specified format')
    .option('-y --yes', 'Answer yes to all prompts')
    .action(options => initiate(options, pkg));

  program
    .command('add <addon>')
    .description('Add an addon to your Storybook')
    .option('-N --use-npm', 'Use NPM to build the Storybook server')
    .option('-s --skip-postinstall', 'Skip package specific postinstall config modifications')
    .action((addonName, options) => add(addonName, options));

  program
    .command('info')
    .description('Prints debugging information about the local environment')
    .action(() => {
      logger.log(chalk.bold('\nEnvironment Info:'));
      envinfo
        .run({
          System: ['OS', 'CPU'],
          Binaries: ['Node', 'Yarn', 'npm'],
          Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
          npmPackages: '@storybook/*',
          npmGlobalPackages: '@storybook/*',
        })
        .then(logger.log);
    });

  program
    .command('migrate [migration]')
    .description('Run a storybook codemod migration on your source files')
    .option('-l --list', 'List available migrations')
    .option('-g --glob <glob>', 'Glob for files upon which to apply the migration', '**/*.js')
    .option('-p --parser <babel | babylon | flow | ts | tsx>', 'jscodeshift parser')
    .option(
      '-n --dry-run',
      'Dry run: verify the migration exists and show the files to which it will be applied'
    )
    .option(
      '-r --rename <from-to>',
      'Rename suffix of matching files after codemod has been applied, e.g. ".js:.ts"'
    )
    .action((migration, { configDir, glob, dryRun, list, rename, parser }) => {
      migrate(migration, { configDir, glob, dryRun, list, rename, parser, logger }).catch(err => {
        logger.error(err);
        process.exit(1);
      });
    });

  program.command('*', { noHelp: true }).action(invalidCmd => {
    logger.error(
      ' Invalid command: %s.\n See --help for a list of available commands.',
      invalidCmd
    );
    // eslint-disable-next-line
    const suggestion = didYouMean(invalidCmd, program.commands.map(cmd => cmd._name));
    if (suggestion) {
      logger.log(`\n Did you mean ${suggestion}?`);
    }
    process.exit(1);
  });

  program
    .usage('<command> [options]')
    .version(pkg.version)
    .parse(process.argv);

  if (program.rawArgs.length < 3) {
    program.help();
  }
}
