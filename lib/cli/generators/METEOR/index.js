import path from 'path';
import fs from 'fs';
import JSON5 from 'json5';
import mergeDirs from 'merge-dirs';
import {
  getVersions,
  getPackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
} from '../../lib/helpers';

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

  const devDependencies = [
    `@storybook/react@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
  ];

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

    devDependencies.push(`@babel/preset-env@${presetEnvVersion}`);
    devDependencies.push(`@babel/preset-react@${presetReactVersion}`);
  }

  fs.writeFileSync('.babelrc', JSON.stringify(babelrc, null, 2), 'utf8');

  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  // add react packages.
  const dependencies = [];
  if (!packageJson.dependencies.react) {
    dependencies.push(`react@${reactVersion}`);
  }
  if (!packageJson.dependencies['react-dom']) {
    dependencies.push(`react-dom@${reactDomVersion}`);
  }

  if (dependencies.length > 0) {
    installDependencies(npmOptions, dependencies);
  }

  installDependencies(npmOptions, [...devDependencies, ...babelDependencies, '-D']);
};
