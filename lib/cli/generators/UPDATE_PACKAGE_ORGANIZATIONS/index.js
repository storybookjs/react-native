/* eslint-disable no-param-reassign */
import path from 'path';
import { spawn } from 'child-process-promise';
import { packageNames } from '@storybook/codemod';
import { getVersion, getVersions, getPackageJson, writePackageJson } from '../../lib/helpers';

async function updatePackage(devDependencies, oldName, newName) {
  if (devDependencies[oldName]) {
    delete devDependencies[oldName];
    devDependencies[newName] = await getVersion(newName);
  }
}

async function addPeerDependencies(packageJson) {
  const [addonsVersion, babelCoreVersion] = await getVersions('@storybook/addons', 'babel-core');

  packageJson.dependencies = packageJson.dependencies || {};

  packageJson.devDependencies['@storybook/addons'] = addonsVersion;

  if (!packageJson.dependencies['babel-core'] && !packageJson.devDependencies['babel-core']) {
    packageJson.devDependencies['babel-core'] = babelCoreVersion;
  }
}

async function updatePackageJson() {
  const packageJson = getPackageJson();
  const { devDependencies } = packageJson;

  await Promise.all(
    Object.keys(packageNames).map(oldName => {
      const newName = packageNames[oldName];
      return updatePackage(devDependencies, oldName, newName);
    })
  );

  if (!devDependencies['@storybook/react'] && !devDependencies['@storybook/react-native']) {
    throw new Error('Expected to find `@kadira/[react-native]-storybook` in devDependencies');
  }

  await addPeerDependencies(packageJson);

  writePackageJson(packageJson);
}

function updateSourceCode(parser) {
  const jscodeshiftPath = path.dirname(require.resolve('jscodeshift'));
  const jscodeshiftCommand = path.join(jscodeshiftPath, 'bin', 'jscodeshift.sh');

  const codemodPath = path.join(
    path.dirname(require.resolve('@storybook/codemod')),
    'transforms',
    'update-organisation-name.js'
  );

  const args = ['-t', codemodPath, '--silent', '--ignore-pattern', '"node_modules|dist"', '.'];
  if (parser) args.push('--parser', parser);

  return spawn(jscodeshiftCommand, args, { stdio: 'inherit' });
}

export default async parser => {
  await updatePackageJson();
  return updateSourceCode(parser);
};
