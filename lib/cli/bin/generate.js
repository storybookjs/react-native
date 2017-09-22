import updateNotifier from 'update-notifier';
import program from 'commander';
import chalk from 'chalk';
import detect from '../lib/detect';
import hasYarn from '../lib/has_yarn';
import types from '../lib/project_types';
import { commandLog, codeLog, paddedLog, installDeps } from '../lib/helpers';
import pkg from '../package.json';
import meteorGenerator from '../generators/METEOR';
import reactGenerator from '../generators/REACT';
import reactNativeGenerator from '../generators/REACT_NATIVE';
import reactNativeScriptsGenerator from '../generators/REACT_NATIVE_SCRIPTS';
import reactScriptsGenerator from '../generators/REACT_SCRIPTS';
import sfcVueGenerator from '../generators/SFC_VUE';
import updateOrganisationsGenerator from '../generators/UPDATE_PACKAGE_ORGANIZATIONS';
import vueGenerator from '../generators/VUE';
import webpackReactGenerator from '../generators/WEBPACK_REACT';

const logger = console;

program
  .version(pkg.version)
  .option('-f --force', 'Forcely add storybook')
  .option('-s --skip-install', 'Skip installing deps')
  .option('-N --use-npm', 'Use npm to install deps')
  .option('-p --parser <babel | babylon | flow>', 'jscodeshift parser')
  .parse(process.argv);

const welcomeMessage = 'getstorybook - the simplest way to add a storybook to your project.';
logger.log(chalk.inverse(`\n ${welcomeMessage} \n`));

const useYarn = Boolean(program.useNpm !== true) && hasYarn();

const npmOptions = {
  useYarn,
};

const runStorybookCommand = useYarn ? 'yarn run storybook' : 'npm run storybook';

// Update notify code.
updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60, // every hour (we could increase this later on.)
}).notify();

let projectType;

const done = commandLog('Detecting project type');
try {
  projectType = detect({
    force: program.force,
  });
} catch (ex) {
  done(ex.message);
  process.exit(1);
}
done();

const end = () => {
  if (!program.skipInstall) {
    installDeps(npmOptions);
  }

  logger.log('\nTo run your storybook, type:\n');
  codeLog([runStorybookCommand]);
  logger.log('\nFor more information visit:', chalk.cyan('https://storybook.js.org'));

  // Add a new line for the clear visibility.
  logger.log();
};

const CRNA_DISCUSSION =
  'https://github.com/storybooks/storybook/blob/master/app/react-native/docs/manual-setup.md';

const runGenerator = () => {
  switch (projectType) {
    case types.ALREADY_HAS_STORYBOOK:
      logger.log();
      paddedLog('There seems to be a storybook already available in this project.');
      paddedLog('Apply following command to force:\n');
      codeLog(['getstorybook -f']);

      // Add a new line for the clear visibility.
      logger.log();
      return Promise.resolve();

    case types.UPDATE_PACKAGE_ORGANIZATIONS:
      // eslint-disable-next-line
      return updateOrganisationsGenerator(program.parser)
        .then(() => null) // commmandLog doesn't like to see output
        .then(commandLog('Upgrading your project to the new storybook packages.'))
        .then(end);

    case types.REACT_SCRIPTS:
      return reactScriptsGenerator()
        .then(commandLog('Adding storybook support to your "Create React App" based project'))
        .then(end);

    case types.REACT:
      return reactGenerator()
        .then(commandLog('Adding storybook support to your "React" app'))
        .then(end);

    case types.REACT_NATIVE_SCRIPTS: {
      const app = chalk.bold('"./App.js"');
      return reactNativeScriptsGenerator()
        .then(commandLog('Adding storybook support to your "Create React Native App" app'))
        .then(end)
        .then(() => {
          logger.log(chalk.red('NOTE: CRNA app installation is not 100% automated.'));
          logger.log(`To quickly run storybook, replace contents of ${app} with:\n`);
          codeLog(["export default from './storybook';"]); // eslint-disable-line
          logger.log('\nFor a more complete discussion of options, see:\n');
          logger.log(chalk.cyan(CRNA_DISCUSSION));
          logger.log();
        });
    }

    case types.REACT_NATIVE:
      return reactNativeGenerator()
        .then(commandLog('Adding storybook support to your "React Native" app'))
        .then(end);

    case types.METEOR:
      return meteorGenerator()
        .then(commandLog('Adding storybook support to your "Meteor" app'))
        .then(end);

    case types.WEBPACK_REACT:
      return webpackReactGenerator()
        .then(commandLog('Adding storybook support to your "Webpack React" app'))
        .then(end);

    case types.REACT_PROJECT:
      return reactGenerator()
        .then(commandLog('Adding storybook support to your "React" library'))
        .then(end);

    case types.SFC_VUE:
      return sfcVueGenerator()
        .then(commandLog('Adding storybook support to your "Single File Components Vue" app'))
        .then(end);

    case types.VUE:
      return vueGenerator()
        .then(commandLog('Adding storybook support to your "Vue" app'))
        .then(end);

    default:
      paddedLog(`We couldn't detect your project type. (code: ${projectType})`);
      paddedLog(
        "Please make sure you are running the `getstorybook` command in your project's root directory."
      );
      paddedLog(
        'You can also follow some of the slow start guides: https://storybook.js.org/basics/slow-start-guide/'
      );

      // Add a new line for the clear visibility.
      logger.log();
      return Promise.resolve();
  }
};

runGenerator().catch(ex => {
  logger.error(`\n     ${chalk.red(ex.stack)}`);
  process.exit(1);
});
