var mergeDirs = require('merge-dirs').default;
var helpers = require('../../lib/helpers');
var path = require('path');
var shell = require('shelljs');

// copy all files from the template directory to project directory
mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

// set correct project name on entry files if possible
var dirname = shell.ls('-d', 'ios/*.xcodeproj').stdout;
var projectName = dirname && dirname.slice(
  'ios/'.length,
  dirname.length - '.xcodeproj'.length - 1
);
if (projectName) {
  shell.sed('-i', '%APP_NAME%', projectName, 'storybook/index.ios.js');
}

var packageJson = helpers.getPackageJson();

// TODO: Get the latest version of storybook here.
packageJson.devDependencies = packageJson.devDependencies || {};
packageJson.devDependencies['@kadira/react-native-storybook'] = '^2.0.0';

packageJson.scripts = packageJson.scripts || {};
packageJson.scripts['storybook'] = 'storybook start -p 7007';

helpers.writePackageJson(packageJson);
