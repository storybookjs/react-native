var mergeDirs = require('merge-dirs').default;
var helpers = require('../../lib/helpers');
var path = require('path');

mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

var packageJson = helpers.getPackageJson();

// TODO: Get the latest version of storybook here.
packageJson.devDependencies['@kadira/storybook'] = '^2.5.2';
packageJson.scripts['storybook'] = 'start-storybook -p 9009';
packageJson.scripts['build-storybook'] = 'build-storybook';

helpers.writePackageJson(packageJson);
