var mergeDirs = require('merge-dirs').default;
var helpers = require('../../lib/helpers');
var path = require('path');
var fs = require('fs');
var sh = require('shelljs');
var JSON5 = require('json5');

mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

var packageJson = helpers.getPackageJson();
packageJson.devDependencies = packageJson.devDependencies || {};
packageJson.scripts = packageJson.scripts || {};
packageJson.dependencies = packageJson.dependencies || {};

// create or update .babelrc
var babelrc = null;
if(fs.existsSync('.babelrc')) {
  var babelrcContent = fs.readFileSync('.babelrc', 'utf8');
  babelrc = JSON5.parse(babelrcContent);
  babelrc.plugins = babelrc.plugins || [];

  if (babelrc.plugins.indexOf('babel-root-slash-import') < 0) {
    babelrc.plugins.push('babel-root-slash-import');
    packageJson.devDependencies['babel-root-slash-import'] = '^1.1.0';
  }
} else {
  babelrc = {
    presets: ['es2015', 'es2016', 'react', 'stage-1'],
    plugins: ['babel-root-slash-import'],
  };

  packageJson.devDependencies['babel-preset-es2015'] = '^6.9.0';
  packageJson.devDependencies['babel-preset-es2016'] = '^6.11.3';
  packageJson.devDependencies['babel-preset-react'] = '^6.11.1';
  packageJson.devDependencies['babel-preset-stage-1'] = '^6.13.0';
  packageJson.devDependencies['babel-root-slash-import'] = '^1.1.0';
}

fs.writeFileSync('.babelrc', JSON.stringify(babelrc, null, 2), 'utf8');

// write the new package.json.
packageJson.devDependencies['@kadira/storybook'] = '^2.5.2';
packageJson.scripts['storybook'] = 'start-storybook -p 6006';
packageJson.scripts['build-storybook'] = 'build-storybook';

// add react packages.
if (!packageJson.dependencies.react) {
  packageJson.dependencies.react = '^15.3.0';
}
if (!packageJson.dependencies['react-dom']) {
  packageJson.dependencies['react-dom'] = '^15.3.0';
}

helpers.writePackageJson(packageJson);
