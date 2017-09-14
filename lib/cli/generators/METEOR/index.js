import path from 'path';
import fs from 'fs';
import JSON5 from 'json5';
import latestVersion from 'latest-version';
import mergeDirs from 'merge-dirs';
import { getPackageJson, writePackageJson } from '../../lib/helpers';
import { devDependencies } from '../../package.json';

export default async () => {
  const storybookVersion = devDependencies['@storybook/react'];
  const actionsVersion = devDependencies['@storybook/addon-actions'];
  const linksVersion = devDependencies['@storybook/addon-links'];

  const [
    reactVersion,
    reactDomVersion,
    presetEnvVersion,
    presetReactVersion,
    presetStage1Version,
    rootSlashImportVersion,
  ] = await Promise.all([
    latestVersion('react'),
    latestVersion('react-dom'),
    latestVersion('babel-preset-env'),
    latestVersion('babel-preset-react'),
    latestVersion('babel-preset-stage-1'),
    latestVersion('babel-root-slash-import'),
  ]);

  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = getPackageJson();
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
  packageJson.devDependencies['@storybook/react'] = storybookVersion;
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  // add react packages.
  if (!packageJson.dependencies.react) {
    packageJson.dependencies.react = `^${reactVersion}`;
  }
  if (!packageJson.dependencies['react-dom']) {
    packageJson.dependencies['react-dom'] = `^${reactDomVersion}`;
  }

  writePackageJson(packageJson);
};
