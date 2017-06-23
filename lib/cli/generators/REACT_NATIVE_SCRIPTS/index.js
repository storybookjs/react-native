const mergeDirs = require('merge-dirs').default;
const helpers = require('../../lib/helpers');
const path = require('path');
const latestVersion = require('latest-version');

module.exports = latestVersion('@storybook/react-native').then(version => {
  // copy all files from the template directory to project directory
  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = helpers.getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.devDependencies['@storybook/react-native'] = `^${version}`;

  if (!packageJson.dependencies['react-dom'] && !packageJson.devDependencies['react-dom']) {
    const reactVersion = packageJson.dependencies.react;
    packageJson.devDependencies['react-dom'] = reactVersion;
  }

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'storybook start -p 7007';

  helpers.writePackageJson(packageJson);
});
