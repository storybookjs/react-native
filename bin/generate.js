var detect = require('../lib/detect');
var types = require('../lib/project_types');
var sh = require('shelljs');

// Add a new line for the clear visibility.
console.log();

const projectType = detect();
switch (projectType) {
  case types.REACT_SCRIPTS:
    // TODO: Add colors.
    // TODO: Add done symbol to the end.
    console.log('Adding storybook support to your "Create React App" based project.');
    require('../generators/REACT_SCRIPTS');
    console.log('Installing NPM dependencies.');
    sh.exec('npm install', { silent: true });
    console.log('\nTo run your storybook, type:\n')
    console.log('   npm run storybook');
    console.log('\nFor more information visit: https://getstorybook.io')
    break;
  default:
    console.log('Unsupported Project type. (code: %s)', projectType);
    console.log('Visit https://getstorybook.io for more information.');
}

// Add a new line for the clear visibility.
console.log();
