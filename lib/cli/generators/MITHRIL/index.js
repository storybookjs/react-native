import path from 'path';
import fs from 'fs';
import JSON5 from 'json5';
import mergeDirs from 'merge-dirs';
import { getVersions, getPackageJson, writePackageJson } from '../../lib/helpers';

export default async npmOptions => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    addonsVersion,
    babelCoreVersion,
    babelPluginTransformReactJsxVersion,
  ] = await getVersions(
    npmOptions,
    '@storybook/mithril',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'babel-core',
    'babel-plugin-transform-react-jsx'
  );

  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;
  packageJson.devDependencies['@storybook/addons'] = addonsVersion;
  packageJson.devDependencies['@storybook/mithril'] = storybookVersion;

  // create or update .babelrc
  let babelrc = null;
  if (fs.existsSync('.babelrc')) {
    const babelrcContent = fs.readFileSync('.babelrc', 'utf8');
    babelrc = JSON5.parse(babelrcContent);
    babelrc.plugins = babelrc.plugins || [];

    if (babelrc.plugins.indexOf('babel-plugin-transform-react-jsx') < 0) {
      babelrc.plugins.push('transform-react-jsx');
      packageJson.devDependencies[
        'babel-plugin-transform-react-jsx'
      ] = babelPluginTransformReactJsxVersion;
    }
  } else {
    babelrc = {
      plugins: ['transform-react-jsx'],
    };

    packageJson.devDependencies['babel-core'] = babelCoreVersion;
    packageJson.devDependencies[
      'babel-plugin-transform-react-jsx'
    ] = babelPluginTransformReactJsxVersion;
  }

  fs.writeFileSync('.babelrc', JSON.stringify(babelrc, null, 2), 'utf8');

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
