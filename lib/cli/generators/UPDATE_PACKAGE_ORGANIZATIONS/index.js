/* eslint-disable no-param-reassign */
import path from 'path';
import { sync as spawnSync } from 'cross-spawn';
import { packageNames } from '@storybook/codemod';
import {
  getVersion,
  getVersions,
  getBabelDependencies,
  installDependencies,
  getPackageJson,
  writePackageJson,
} from '../../lib/helpers';

async function updatePackage(devDependencies, oldName, newName, npmOptions) {
  if (devDependencies[oldName]) {
    delete devDependencies[oldName];
    devDependencies[newName] = await getVersion(npmOptions, newName);
  }
}

async function updatePackageJson(npmOptions) {
  const packageJson = getPackageJson();
  const { devDependencies } = packageJson;

  const [actionsVersion, linksVersion] = await getVersions(
    npmOptions,
    '@storybook/addon-actions',
    '@storybook/addon-links'
  );

  devDependencies['@storybook/addon-actions'] = actionsVersion;
  devDependencies['@storybook/addon-links'] = linksVersion;

  await Promise.all(
    Object.keys(packageNames).map(oldName => {
      const newName = packageNames[oldName];
      return updatePackage(devDependencies, oldName, newName, npmOptions);
    })
  );

  if (!devDependencies['@storybook/react'] && !devDependencies['@storybook/react-native']) {
    throw new Error('Expected to find `@kadira/[react-native]-storybook` in devDependencies');
  }

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies(npmOptions, [...babelDependencies, '-D']);
}

function updateSourceCode(parser) {
  const jscodeshiftPath = path.dirname(require.resolve('jscodeshift'));
  const jscodeshiftCommand = path.join(jscodeshiftPath, 'bin', 'jscodeshift.sh');

  ['update-organisation-name.js', 'move-buildin-addons.js'].forEach(codemod => {
    const codemodPath = path.join(
      path.dirname(require.resolve('@storybook/codemod')),
      'transforms',
      codemod
    );

    const args = ['-t', codemodPath, '--silent', '--ignore-pattern', '"node_modules|dist"', '.'];
    if (parser) args.push('--parser', parser);

    spawnSync(jscodeshiftCommand, args, { stdio: 'inherit' });
  });
}

export default async (parser, npmOptions) => {
  await updatePackageJson(npmOptions);
  updateSourceCode(parser);
};
