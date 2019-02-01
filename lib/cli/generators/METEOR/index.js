import path from 'path';
import fs from 'fs';
import JSON5 from 'json5';
import mergeDirs from 'merge-dirs';
import { getVersions, getPackageJson, writePackageJson, installBabel } from '../../lib/helpers';

export default async npmOptions => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    addonsVersion,
    reactVersion,
    reactDomVersion,
    presetEnvVersion,
    presetReactVersion,
  ] = await getVersions(
    npmOptions,
    '@storybook/react',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'react',
    'react-dom',
    '@babel/preset-env',
    '@babel/preset-react'
  );

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
  } else {
    babelrc = {
      presets: [
        ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage' }],
        '@babel/preset-react',
      ],
    };

    packageJson.devDependencies['@babel/preset-env'] = presetEnvVersion;
    packageJson.devDependencies['@babel/preset-react'] = presetReactVersion;
  }

  fs.writeFileSync('.babelrc', JSON.stringify(babelrc, null, 2), 'utf8');

  // write the new package.json.
  packageJson.devDependencies['@storybook/react'] = storybookVersion;
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;
  packageJson.devDependencies['@storybook/addons'] = addonsVersion;

  await installBabel(npmOptions, packageJson);

  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  // add react packages.
  if (!packageJson.dependencies.react) {
    packageJson.dependencies.react = reactVersion;
  }
  if (!packageJson.dependencies['react-dom']) {
    packageJson.dependencies['react-dom'] = reactDomVersion;
  }

  writePackageJson(packageJson);
};
