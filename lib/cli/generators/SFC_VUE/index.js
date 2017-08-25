const mergeDirs = require('merge-dirs').default;
const helpers = require('../../lib/helpers');
const path = require('path');
const latestVersion = require('latest-version');

module.exports = Promise.all([
  latestVersion('@storybook/vue'),
  latestVersion('@storybook/addon-actions'),
  latestVersion('@storybook/addon-links'),
]).then(([storybookVersion, actionsVersion, linksVersion]) => {
  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  const packageJson = helpers.getPackageJson();

  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/vue'] = `^${storybookVersion}`;
  packageJson.devDependencies['@storybook/addon-actions'] = `^${actionsVersion}`;
  packageJson.devDependencies['@storybook/addon-links'] = `^${linksVersion}`;

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  helpers.writePackageJson(packageJson);
});
