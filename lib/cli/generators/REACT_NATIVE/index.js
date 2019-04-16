import mergeDirs from 'merge-dirs';
import path from 'path';
import shell from 'shelljs';
import chalk from 'chalk';
import { getVersions, getPackageJson, writePackageJson, paddedLog, installBabel } from '../../lib/helpers';

export default async (npmOptions, installServer) => {
  const [
    storybookVersion,
    addonsVersion,
    actionsVersion,
    linksVersion,
  ] = await getVersions(
    npmOptions,
    '@storybook/react-native',
    '@storybook/addons',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  );

  // copy all files from the template directory to project directory
  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  // set correct project name on entry files if possible
  const dirname = shell.ls('-d', 'ios/*.xcodeproj').stdout;

  // Only notify about app name if running in React Native vanilla (Expo projects do not have ios directory)
  if (dirname) {
    const projectName =
      dirname && dirname.slice('ios/'.length, dirname.length - '.xcodeproj'.length - 1);
    if (projectName) {
      shell.sed('-i', '%APP_NAME%', projectName, 'storybook/storybook.js');
    } else {
      paddedLog(
        chalk.red(
          'ERR: Could not determine project name, to fix: https://github.com/storybooks/storybook/issues/1277'
        )
      );
    }
  }

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  if (installServer) {
    packageJson.devDependencies['@storybook/react-native-server'] = storybookVersion;
  }

  packageJson.devDependencies['@storybook/react-native'] = storybookVersion;
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;
  packageJson.devDependencies['@storybook/addons'] = addonsVersion;

  await installBabel(npmOptions, packageJson);

  if (!packageJson.dependencies['react-dom'] && !packageJson.devDependencies['react-dom']) {
    const reactVersion = packageJson.dependencies.react;
    packageJson.devDependencies['react-dom'] = reactVersion;
  }

  if (installServer) {
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.storybook = 'start-storybook -p 7007';
  }

  writePackageJson(packageJson);
};
