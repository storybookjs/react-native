const mergeDirs = require('merge-dirs').default;
const path = require('path');
const shell = require('shelljs');
const latestVersion = require('latest-version');
const chalk = require('chalk');
const helpers = require('../../lib/helpers');

module.exports = Promise.all([
  latestVersion('@storybook/react'),
  latestVersion('@storybook/addon-actions'),
  latestVersion('@storybook/addon-links'),
  latestVersion('prop-types'),
]).then(([storybookVersion, actionsVersion, linksVersion, propTypesVersion]) => {
  // copy all files from the template directory to project directory
  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  // set correct project name on entry files if possible
  const dirname = shell.ls('-d', 'ios/*.xcodeproj').stdout;
  const projectName =
    dirname && dirname.slice('ios/'.length, dirname.length - '.xcodeproj'.length - 1);
  if (projectName) {
    shell.sed('-i', '%APP_NAME%', projectName, 'storybook/storybook.js');
  } else {
    helpers.paddedLog(
      chalk.red(
        'ERR: Could not determine project name, to fix: https://github.com/storybooks/storybook/issues/1277'
      )
    );
  }

  const packageJson = helpers.getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.devDependencies['@storybook/react'] = `^${storybookVersion}`;
  packageJson.devDependencies['@storybook/addon-actions'] = `^${actionsVersion}`;
  packageJson.devDependencies['@storybook/addon-links'] = `^${linksVersion}`;

  if (!packageJson.dependencies['react-dom'] && !packageJson.devDependencies['react-dom']) {
    const reactVersion = packageJson.dependencies.react;
    packageJson.devDependencies['react-dom'] = reactVersion;
  }

  if (!packageJson.dependencies['prop-types'] && !packageJson.devDependencies['prop-types']) {
    packageJson.devDependencies['prop-types'] = `^${propTypesVersion}`;
  }

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'storybook start -p 7007';

  helpers.writePackageJson(packageJson);
});
