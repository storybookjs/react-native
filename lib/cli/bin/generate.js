import updateNotifier from 'update-notifier';
import program from 'commander';
import chalk from 'chalk';
import detect from '../lib/detect';
import hasYarn from '../lib/has_yarn';
import types from '../lib/project_types';
import { commandLog, codeLog, paddedLog, installDeps } from '../lib/helpers';
import pkg from '../package.json';

const logger = console;

program
  .version(pkg.version)
  .option('-f --force', 'Forcely add storybook')
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
  installDeps(npmOptions);

  logger.log('\nTo run your storybook, type:\n');
  codeLog([runStorybookCommand]);
  logger.log('\nFor more information visit:', chalk.cyan('https://storybook.js.org'));

  // Add a new line for the clear visibility.
  logger.log();
};

const CRNA_DISCUSSION =
  'https://github.com/storybooks/storybook/blob/master/app/react-native/docs/manual-setup.md';

switch (projectType) {
  case types.ALREADY_HAS_STORYBOOK:
    logger.log();
    paddedLog('There seems to be a storybook already available in this project.');
    paddedLog('Apply following command to force:\n');
    codeLog(['getstorybook -f']);

    // Add a new line for the clear visibility.
    logger.log();
    break;

  case types.UPDATE_PACKAGE_ORGANIZATIONS:
    // eslint-disable-next-line
    require('../generators/UPDATE_PACKAGE_ORGANIZATIONS').default(program.parser)
      .then(() => null) // commmandLog doesn't like to see output
      .then(commandLog('Upgrading your project to the new storybook packages.'))
      .then(end);
    break;

  case types.REACT_SCRIPTS:
    // eslint-disable-next-line
    require('../generators/REACT_SCRIPTS').default
      .then(commandLog('Adding storybook support to your "Create React App" based project'))
      .then(end);
    break;

  case types.REACT:
    // eslint-disable-next-line
    require('../generators/REACT').default
      .then(commandLog('Adding storybook support to your "React" app'))
      .then(end);
    break;

  case types.REACT_NATIVE_SCRIPTS: {
    const app = chalk.bold('"./App.js"');
    // eslint-disable-next-line
    require('../generators/REACT_NATIVE_SCRIPTS').default
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
    break;
  }

  case types.REACT_NATIVE:
    // eslint-disable-next-line
    require('../generators/REACT_NATIVE').default
      .then(commandLog('Adding storybook support to your "React Native" app'))
      .then(end);
    break;

  case types.METEOR:
    // eslint-disable-next-line
    require('../generators/METEOR').default
      .then(commandLog('Adding storybook support to your "Meteor" app'))
      .then(end);
    break;

  case types.WEBPACK_REACT:
    // eslint-disable-next-line
    require('../generators/WEBPACK_REACT').default
      .then(commandLog('Adding storybook support to your "Webpack React" app'))
      .then(end);
    break;

  case types.REACT_PROJECT:
    // eslint-disable-next-line
    require('../generators/REACT').default
      .then(commandLog('Adding storybook support to your "React" library'))
      .then(end);
    break;

  case types.SFC_VUE:
    // eslint-disable-next-line
    require('../generators/SFC_VUE').default
      .then(commandLog('Adding storybook support to your "Single File Components Vue" app'))
      .then(end);
    break;

  case types.VUE:
    // eslint-disable-next-line
    require('../generators/VUE').default
      .then(commandLog('Adding storybook support to your "Vue" app'))
      .then(end);
    break;

  default:
    paddedLog(`Unsupported Project type. (code: ${projectType})`);
    paddedLog('Visit https://storybook.js.org for more information.');

    // Add a new line for the clear visibility.
    logger.log();
}
