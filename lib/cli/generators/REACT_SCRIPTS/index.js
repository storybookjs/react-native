const mergeDirs = require('merge-dirs').default;
const helpers = require('../../lib/helpers');
const path = require('path');
const fs = require('fs');

mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

const packageJson = helpers.getPackageJson();

// TODO: Get the latest version of storybook here.
packageJson.devDependencies['@storybook/react'] = '^2.21.0';
packageJson.scripts.storybook = 'start-storybook -p 9009';
packageJson.scripts['build-storybook'] = 'build-storybook';

if (fs.existsSync(path.resolve('./public'))) {
  // has a public folder and add support to it.
  packageJson.scripts.storybook += ' -s public';
  packageJson.scripts['build-storybook'] += ' -s public';
}

helpers.writePackageJson(packageJson);
