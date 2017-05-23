const mergeDirs = require('merge-dirs').default;
const helpers = require('../../lib/helpers');
const path = require('path');
const shell = require('shelljs');
const latestVersion = require('latest-version');

module.exports = latestVersion('@storybook/react-native').then(version => {
  // copy all files from the template directory to project directory
  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  // set correct project name on entry files if possible
  const dirname = shell.ls('-d', 'ios/*.xcodeproj').stdout;
  const projectName =
    dirname && dirname.slice('ios/'.length, dirname.length - '.xcodeproj'.length - 1);
  if (projectName) {
    shell.sed('-i', '%APP_NAME%', projectName, 'storybook/index.ios.js');
    shell.sed('-i', '%APP_NAME%', projectName, 'storybook/index.android.js');
  }

  const packageJson = helpers.getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.devDependencies['@storybook/react-native'] = `^${version}`;

  if (!packageJson.dependencies['react-dom'] && !packageJson.devDependencies['react-dom']) {
    packageJson.devDependencies['react-dom'] = '^15.5.4';
  }

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts['storybook'] = 'storybook start -p 7007';

  helpers.writePackageJson(packageJson);
});
