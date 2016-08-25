#!/usr/bin/env node

/* eslint global-require: 0 */

var updateNotifier = require('update-notifier');
var program = require('commander');
var detect = require('../lib/detect');
var types = require('../lib/project_types');
var commandLog = require('../lib/helpers').commandLog;
var codeLog = require('../lib/helpers').codeLog;
var paddedLog = require('../lib/helpers').paddedLog;
var installNpmDeps = require('../lib/helpers').installNpmDeps;
var chalk = require('chalk');
var logger = console;

var pkg = require('../package.json');

program
  .version(pkg.version)
  .option('-f --force', 'Forcely add storybook')
  .parse(process.argv);

var welcomeMessage =
  'getstorybook - the simplest way to add a storybook to your project.';
logger.log(chalk.inverse('\n ' + welcomeMessage + ' \n'));

// Update notify code.
updateNotifier({
  pkg: pkg,
  updateCheckInterval: 1000 * 60 * 60 // every hour (we could increase this later on.)
}).notify();

var projectType;

var done = commandLog('Detecting project type');
try {
  projectType = detect({
    force: program.force
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
    require('../generators/REACT_SCRIPTS');
    done();

    installNpmDeps();

    logger.log('\nTo run your storybook, type:\n');
    codeLog([
      'npm run storybook'
    ]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  case types.REACT:
    done = commandLog('Adding storybook support to your "React" app');
    require('../generators/REACT');
    done();

    installNpmDeps();

    logger.log('\nTo run your storybook, type:\n');
    codeLog([
      'npm run storybook'
    ]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  case types.REACT_NATIVE:
    done = commandLog('Adding storybook support to your "React Native" app');
    require('../generators/REACT_NATIVE');
    done();

    installNpmDeps();

    logger.log('\nTo run your storybook, type:\n');
    codeLog([
      'npm run storybook'
    ]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  case types.METEOR:
    done = commandLog('Adding storybook support to your "Meteor" app');
    require('../generators/METEOR');
    done();

    installNpmDeps();

    logger.log('\nTo run your storybook, type:\n');
    codeLog([
      'npm run storybook'
    ]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  case types.WEBPACK_REACT:
    done = commandLog('Adding storybook support to your "Webpack React" app');
    require('../generators/WEBPACK_REACT');
    done();

    installNpmDeps();

    logger.log('\nTo run your storybook, type:\n');
    codeLog([
      'npm run storybook'
    ]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  case types.REACT_PROJECT:
    done = commandLog('Adding storybook support to your "React" library');
    require('../generators/REACT');
    done();

    installNpmDeps();

    logger.log('\nTo run your storybook, type:\n');
    codeLog([
      'npm run storybook'
    ]);
    logger.log('\nFor more information visit:', chalk.cyan('http://getstorybook.io'));
    break;

  default:
    paddedLog('Unsupported Project type. (code: ' + projectType + ')');
    paddedLog('Visit http://getstorybook.io for more information.');
}

// Add a new line for the clear visibility.
logger.log();
