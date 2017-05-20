#!/usr/bin/env node

const updateNotifier = require('update-notifier');
const program = require('commander');
const chalk = require('chalk');
const detect = require('../lib/detect');
const hasYarn = require('../lib/has_yarn');
const types = require('../lib/project_types');
const commandLog = require('../lib/helpers').commandLog;
const codeLog = require('../lib/helpers').codeLog;
const paddedLog = require('../lib/helpers').paddedLog;
const installDeps = require('../lib/helpers').installDeps;
const logger = console;

const pkg = require('../package.json');

program
  .version(pkg.version)
  .option('-f --force', 'Forcely add storybook')
  .option('-N --use-npm', 'Use npm to install deps')
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
  logger.log('\nFor more information visit:', chalk.cyan('https://storybooks.js.org'));

  // Add a new line for the clear visibility.
  logger.log();
};

switch (projectType) {
  case types.ALREADY_HAS_STORYBOOK:
    logger.log();
    paddedLog('There seems to be a storybook already available in this project.');
    paddedLog('Apply following command to force:\n');
    codeLog(['getstorybook -f']);

    // Add a new line for the clear visibility.
    logger.log();
    break;
  case types.REACT_SCRIPTS:
    require('../generators/REACT_SCRIPTS')
      .then(commandLog('Adding storybook support to your "Create React App" based project'))
      .then(end);
    break;

  case types.REACT:
    require('../generators/REACT')
      .then(commandLog('Adding storybook support to your "React" app'))
      .then(end);
    break;

  case types.REACT_NATIVE:
    require('../generators/REACT_NATIVE')
      .then(commandLog('Adding storybook support to your "React Native" app'))
      .then(end);
    break;

  case types.METEOR:
    require('../generators/METEOR')
      .then(commandLog('Adding storybook support to your "Meteor" app'))
      .then(end);
    break;

  case types.WEBPACK_REACT:
    require('../generators/WEBPACK_REACT')
      .then(commandLog('Adding storybook support to your "Webpack React" app'))
      .then(end);
    break;

  case types.REACT_PROJECT:
    require('../generators/REACT')
      .then(commandLog('Adding storybook support to your "React" library'))
      .then(end);
    break;

  default:
    paddedLog(`Unsupported Project type. (code: ${projectType})`);
    paddedLog('Visit https://storybooks.js.org for more information.');

    // Add a new line for the clear visibility.
    logger.log();
}
