const mergeDirs = require('merge-dirs').default;
const helpers = require('../../lib/helpers');
const path = require('path');
const fs = require('fs');
const JSON5 = require('json5');
const latestVersion = require('latest-version');

module.exports = Promise.all([
  latestVersion('@storybook/react'),
  latestVersion('react'),
  latestVersion('react-dom'),
  latestVersion('babel-preset-env'),
  latestVersion('babel-preset-react'),
  latestVersion('babel-preset-stage-1'),
  latestVersion('babel-root-slash-import'),
]).then(
  (
    [
      storybookVersion,
      reactVersion,
      reactDomVersion,
      presetEnvVersion,
      presetReactVersion,
      presetStage1Version,
      rootSlashImportVersion,
    ]
  ) => {
    mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

    const packageJson = helpers.getPackageJson();
    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.scripts = packageJson.scripts || {};
    packageJson.dependencies = packageJson.dependencies || {};

    // create or update .babelrc
    let babelrc = null;
    if (fs.existsSync('.babelrc')) {
      const babelrcContent = fs.readFileSync('.babelrc', 'utf8');
      babelrc = JSON5.parse(babelrcContent);
      babelrc.plugins = babelrc.plugins || [];

      if (babelrc.plugins.indexOf('babel-root-slash-import') < 0) {
        babelrc.plugins.push('babel-root-slash-import');
        packageJson.devDependencies['babel-root-slash-import'] = `^${rootSlashImportVersion}`;
      }
    } else {
      babelrc = {
        presets: ['env', 'react', 'stage-1'],
        plugins: ['babel-root-slash-import'],
      };

      packageJson.devDependencies['babel-preset-env'] = `^${presetEnvVersion}`;
      packageJson.devDependencies['babel-preset-react'] = `^${presetReactVersion}`;
      packageJson.devDependencies['babel-preset-stage-1'] = `^${presetStage1Version}`;
      packageJson.devDependencies['babel-root-slash-import'] = `^${rootSlashImportVersion}`;
    }

    fs.writeFileSync('.babelrc', JSON.stringify(babelrc, null, 2), 'utf8');

    // write the new package.json.
    packageJson.devDependencies['@storybook/react'] = `^${storybookVersion}`;
    packageJson.scripts.storybook = 'start-storybook -p 6006';
    packageJson.scripts['build-storybook'] = 'build-storybook';

    // add react packages.
    if (!packageJson.dependencies.react) {
      packageJson.dependencies.react = `^${reactVersion}`;
    }
    if (!packageJson.dependencies['react-dom']) {
      packageJson.dependencies['react-dom'] = `^${reactDomVersion}`;
    }

    helpers.writePackageJson(packageJson);
  }
);
