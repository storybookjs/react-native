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
const pkg = require('../package.json');

const logger = console;

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

let done = commandLog('Detecting project type');
try {
  projectType = detect({
    force: program.force,
  });
} catch (ex) {
  done(ex.message);
  process.exit(1);
}
done();

switch (projectType) {
  case types.ALREADY_HAS_STORYBOOK:
    logger.log();
    paddedLog('There seems to be a storybook already available in this project.');
    paddedLog('Apply following command to force:\n');
    codeLog(['getstorybook -f']);
    break;
  case types.REACT_SCRIPTS:
    done = commandLog('Adding storybook support to your "Create React App" based project');
    require('../generators/REACT_SCRIPTS'); // eslint-disable-line
    done();

    installDeps(npmOptions);

    logger.log('\nTo run your storybook, type:\n');
    codeLog([runStorybookCommand]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  case types.REACT:
    done = commandLog('Adding storybook support to your "React" app');
    require('../generators/REACT'); // eslint-disable-line
    done();

    installDeps(npmOptions);

    logger.log('\nTo run your storybook, type:\n');
    codeLog([runStorybookCommand]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  case types.REACT_NATIVE:
    done = commandLog('Adding storybook support to your "React Native" app');
    require('../generators/REACT_NATIVE'); // eslint-disable-line
    done();

    installDeps(npmOptions);

    logger.log('\nTo run your storybook, type:\n');
    codeLog([runStorybookCommand]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  case types.METEOR:
    done = commandLog('Adding storybook support to your "Meteor" app');
    require('../generators/METEOR'); // eslint-disable-line
    done();

    installDeps(npmOptions);

    logger.log('\nTo run your storybook, type:\n');
    codeLog([runStorybookCommand]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  case types.WEBPACK_REACT:
    done = commandLog('Adding storybook support to your "Webpack React" app');
    require('../generators/WEBPACK_REACT'); // eslint-disable-line
    done();

    installDeps(npmOptions);

    logger.log('\nTo run your storybook, type:\n');
    codeLog([runStorybookCommand]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  case types.REACT_PROJECT:
    done = commandLog('Adding storybook support to your "React" library');
    require('../generators/REACT'); // eslint-disable-line
    done();

    installDeps(npmOptions);

    logger.log('\nTo run your storybook, type:\n');
    codeLog([runStorybookCommand]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  default:
    paddedLog(`Unsupported Project type. (code: ${projectType})`);
    paddedLog('Visit http://getstorybook.io for more information.');
}

// Add a new line for the clear visibility.
logger.log();
