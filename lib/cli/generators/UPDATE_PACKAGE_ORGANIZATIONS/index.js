/* eslint-disable no-param-reassign */
import path from 'path';
import { spawn } from 'child-process-promise';
import { packageNames } from '@storybook/codemod';
import { getVersion, getVersions, getPackageJson, writePackageJson } from '../../lib/helpers';

async function updatePackage(devDependencies, oldName, newName, npmOptions) {
  if (devDependencies[oldName]) {
    delete devDependencies[oldName];
    devDependencies[newName] = await getVersion(npmOptions, newName);
  }
}

async function addPeerDependencies(packageJson, npmOptions) {
  const [addonsVersion, babelCoreVersion, babelRuntimeVersion] = await getVersions(
    npmOptions,
    '@storybook/addons',
    'babel-core',
    'babel-runtime'
  );

  packageJson.dependencies = packageJson.dependencies || {};

  packageJson.devDependencies['@storybook/addons'] = addonsVersion;

  if (!packageJson.dependencies['babel-core'] && !packageJson.devDependencies['babel-core']) {
    packageJson.devDependencies['babel-core'] = babelCoreVersion;
  }
  if (!packageJson.dependencies['babel-runtime'] && !packageJson.devDependencies['babel-runtime']) {
    packageJson.devDependencies['babel-runtime'] = babelRuntimeVersion;
  }
}

async function updatePackageJson(npmOptions) {
  const packageJson = getPackageJson();
  const { devDependencies } = packageJson;

  await Promise.all(
    Object.keys(packageNames).map(oldName => {
      const newName = packageNames[oldName];
      return updatePackage(devDependencies, oldName, newName, npmOptions);
    })
  );

  if (!devDependencies['@storybook/react'] && !devDependencies['@storybook/react-native']) {
    throw new Error('Expected to find `@kadira/[react-native]-storybook` in devDependencies');
  }

  await addPeerDependencies(packageJson, npmOptions);

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

export default async (parser, npmOptions) => {
  await updatePackageJson(npmOptions);
  return updateSourceCode(parser);
};
