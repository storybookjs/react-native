var mergeDirs = require('merge-dirs').default;
var helpers = require('../../lib/helpers');
var path = require('path');
var fs = require('fs');

mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

var packageJson = helpers.getPackageJson();

// TODO: Get the latest version of storybook here.
packageJson.devDependencies['@kadira/storybook'] = '^2.21.0';
packageJson.scripts['storybook'] = 'start-storybook -p 9009';
packageJson.scripts['build-storybook'] = 'build-storybook';

if (fs.existsSync(path.resolve('./public'))) {
  // has a public folder and add support to it.
  packageJson.scripts['storybook'] += ' -s public';
  packageJson.scripts['build-storybook'] += ' -s public';
}

helpers.writePackageJson(packageJson);
