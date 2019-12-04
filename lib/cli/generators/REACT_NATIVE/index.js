import shell from 'shelljs';
import chalk from 'chalk';
import {
  getVersions,
  retrievePackageJson,
  writePackageJson,
  paddedLog,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
} from '../../lib/helpers';

export default async (npmOptions, installServer, { storyFormat = 'csf' }) => {
  const [storybookVersion, addonsVersion, actionsVersion, linksVersion] = await getVersions(
    npmOptions,
    '@storybook/react-native',
    '@storybook/addons',
    '@storybook/addon-actions',
    '@storybook/addon-links'
  );

  copyTemplate(__dirname, storyFormat);

  // set correct project name on entry files if possible
  const dirname = shell.ls('-d', 'ios/*.xcodeproj').stdout;

  // Only notify about app name if running in React Native vanilla (Expo projects do not have ios directory)
  if (dirname) {
    const projectName = dirname.slice('ios/'.length, dirname.length - '.xcodeproj'.length - 1);

    if (projectName) {
      shell.sed('-i', '%APP_NAME%', projectName, 'storybook/storybook.js');
    } else {
      paddedLog(
        chalk.red(
          'ERR: Could not determine project name, to fix: https://github.com/storybookjs/storybook/issues/1277'
        )
      );
    }
  }

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  const devDependencies = [
    `@storybook/react-native@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
  ];

  if (installServer) {
    devDependencies.push(`@storybook/react-native-server@${storybookVersion}`);
  }

  if (!packageJson.dependencies['react-dom'] && !packageJson.devDependencies['react-dom']) {
    if (packageJson.dependencies.react) {
      const reactVersion = packageJson.dependencies.react;
      devDependencies.push(`react-dom@${reactVersion}`);
    }
  }

  if (installServer) {
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.storybook = 'start-storybook -p 7007';
  }

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [...devDependencies, ...babelDependencies]);
};
