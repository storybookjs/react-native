import path from 'path';
import { spawn } from 'child-process-promise';
import { packageNames } from '@storybook/codemod';
import { getVersion, getPackageJson, writePackageJson } from '../../lib/helpers';

async function updatePackage(devDependencies, oldName, newName) {
  if (devDependencies[oldName]) {
    /* eslint-disable no-param-reassign */
    delete devDependencies[oldName];
    devDependencies[newName] = await getVersion(newName);
    /* eslint-enable */
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
