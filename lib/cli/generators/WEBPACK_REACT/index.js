const mergeDirs = require('merge-dirs').default;
const helpers = require('../../lib/helpers');
const path = require('path');

mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

const packageJson = helpers.getPackageJson();

// TODO: Get the latest version of storybook here.
packageJson.devDependencies = packageJson.devDependencies || {};
packageJson.devDependencies['@storybook/react'] = '^2.21.0';

packageJson.scripts = packageJson.scripts || {};
packageJson.scripts.storybook = 'start-storybook -p 6006';
packageJson.scripts['build-storybook'] = 'build-storybook';

helpers.writePackageJson(packageJson);
