import updateNotifier from 'update-notifier';
import chalk from 'chalk';
import detect from './detect';
import hasYarn from './has_yarn';
import types from './project_types';
import { commandLog, codeLog, paddedLog, installDeps } from './helpers';
import angularGenerator from '../generators/ANGULAR';
import emberGenerator from '../generators/EMBER';
import meteorGenerator from '../generators/METEOR';
import reactGenerator from '../generators/REACT';
import reactNativeGenerator from '../generators/REACT_NATIVE';
import reactNativeScriptsGenerator from '../generators/REACT_NATIVE_SCRIPTS';
import reactScriptsGenerator from '../generators/REACT_SCRIPTS';
import sfcVueGenerator from '../generators/SFC_VUE';
import updateOrganisationsGenerator from '../generators/UPDATE_PACKAGE_ORGANIZATIONS';
import vueGenerator from '../generators/VUE';
import polymerGenerator from '../generators/POLYMER';
import webpackReactGenerator from '../generators/WEBPACK_REACT';
import mithrilGenerator from '../generators/MITHRIL';
import markoGenerator from '../generators/MARKO';
import htmlGenerator from '../generators/HTML';
import riotGenerator from '../generators/RIOT';

const logger = console;

export default function(options, pkg) {
  const welcomeMessage = 'storybook init - the simplest way to add a storybook to your project.';
  logger.log(chalk.inverse(`\n ${welcomeMessage} \n`));

  const useYarn = Boolean(options.useNpm !== true) && hasYarn();

  const npmOptions = {
    useYarn,
  };

  const runStorybookCommand = 'storybook start';

  // Update notify code.
  updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60, // every hour (we could increase this later on.)
  }).notify();

  let projectType;

  const done = commandLog('Detecting project type');
  try {
    projectType = detect(options);
  } catch (ex) {
    done(ex.message);
    process.exit(1);
  }
  done();

  const end = () => {
    if (!options.skipInstall) {
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
        codeLog(['storybook init -f']);

        // Add a new line for the clear visibility.
        logger.log();
        return Promise.resolve();

      case types.UPDATE_PACKAGE_ORGANIZATIONS:
        return updateOrganisationsGenerator(options.parser, npmOptions)
          .then(() => null) // commmandLog doesn't like to see output
          .then(commandLog('Upgrading your project to the new storybook packages.'))
          .then(end);

      case types.REACT_SCRIPTS:
        return reactScriptsGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "Create React App" based project'))
          .then(end);

      case types.REACT:
        return reactGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "React" app'))
          .then(end);

      case types.REACT_NATIVE_SCRIPTS: {
        const app = chalk.bold('"./App.js"');
        return reactNativeScriptsGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "Create React Native App" app'))
          .then(end)
          .then(() => {
            logger.log(chalk.red('NOTE: CRNA app installation is not 100% automated.'));
            logger.log(`To quickly run storybook, replace contents of ${app} with:\n`);
            codeLog(["export default from './storybook';"]);
            logger.log('\nFor a more complete discussion of options, see:\n');
            logger.log(chalk.cyan(CRNA_DISCUSSION));
            logger.log();
          });
      }

      case types.REACT_NATIVE:
        return reactNativeGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "React Native" app'))
          .then(end);

      case types.METEOR:
        return meteorGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "Meteor" app'))
          .then(end);

      case types.WEBPACK_REACT:
        return webpackReactGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "Webpack React" app'))
          .then(end);

      case types.REACT_PROJECT:
        return reactGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "React" library'))
          .then(end);

      case types.SFC_VUE:
        return sfcVueGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "Single File Components Vue" app'))
          .then(end);

      case types.VUE:
        return vueGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "Vue" app'))
          .then(end);

      case types.ANGULAR:
        return angularGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "Angular" app'))
          .then(end);

      case types.EMBER:
        return emberGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "Ember" app'))
          .then(end);

      case types.POLYMER:
        return polymerGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "Polymer" app'))
          .then(end);

      case types.MITHRIL:
        return mithrilGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "Mithril" app'))
          .then(end);

      case types.MARKO:
        return markoGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "Marko" app'))
          .then(end);

      case types.HTML:
        return htmlGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "HTML" app'))
          .then(end);

      case types.RIOT:
        return riotGenerator(npmOptions)
          .then(commandLog('Adding storybook support to your "riot.js" app'))
          .then(end);

      default:
        paddedLog(`We couldn't detect your project type. (code: ${projectType})`);
        paddedLog(
          "Please make sure you are running the `storybook init` command in your project's root directory."
        );
        paddedLog(
          'You can also install storybook for plain HTML snippets with `storybook init --html` or follow some of the slow start guides: https://storybook.js.org/basics/slow-start-guide/'
        );

        // Add a new line for the clear visibility.
        logger.log();
        return Promise.resolve();
    }
  };

  return runGenerator().catch(ex => {
    logger.error(`\n     ${chalk.red(ex.stack)}`);
    process.exit(1);
  });
}
