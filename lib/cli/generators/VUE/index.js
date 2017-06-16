const mergeDirs = require('merge-dirs').default;
const helpers = require('../../lib/helpers');
const path = require('path');
const latestVersion = require('latest-version');

module.exports = latestVersion('@storybook/vue').then(version => {
  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  const packageJson = helpers.getPackageJson();

  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/vue'] = `^${version}`;

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  helpers.writePackageJson(packageJson);
});
