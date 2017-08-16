const mergeDirs = require('merge-dirs').default;
const helpers = require('../../lib/helpers');
const path = require('path');
const fs = require('fs');
const latestVersion = require('latest-version');

module.exports = Promise.all([
  latestVersion('@storybook/react'),
  latestVersion('@storybook/addon-actions'),
  latestVersion('@storybook/addon-links'),
]).then(([storybookVersion, actionsVersion, linksVersion]) => {
  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = helpers.getPackageJson();

  packageJson.devDependencies['@storybook/react'] = `^${storybookVersion}`;
  packageJson.devDependencies['@storybook/addon-actions'] = `^${actionsVersion}`;
  packageJson.devDependencies['@storybook/addon-links'] = `^${linksVersion}`;
  packageJson.scripts.storybook = 'start-storybook -p 9009';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  if (fs.existsSync(path.resolve('./public'))) {
    // has a public folder and add support to it.
    packageJson.scripts.storybook += ' -s public';
    packageJson.scripts['build-storybook'] += ' -s public';
  }

  helpers.writePackageJson(packageJson);
});
