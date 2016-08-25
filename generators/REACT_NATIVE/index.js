var mergeDirs = require('merge-dirs').default;
var helpers = require('../../lib/helpers');
var path = require('path');

mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

var packageJson = helpers.getPackageJson();

// TODO: Get the latest version of storybook here.
packageJson.devDependencies = packageJson.devDependencies || {};
packageJson.devDependencies['@kadira/react-native-storybook'] = '^2.0.0';

packageJson.scripts = packageJson.scripts || {};
packageJson.scripts['storybook'] = 'storybook start -p 7007';

helpers.writePackageJson(packageJson);
