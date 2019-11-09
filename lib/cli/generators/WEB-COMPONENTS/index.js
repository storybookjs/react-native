import fse from 'fs-extra';
import path from 'path';
import {
  getVersion,
  retrievePackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
} from '../../lib/helpers';

export default async npmOptions => {
  const storybookVersion = await getVersion(npmOptions, '@storybook/web-components');
  fse.copySync(path.resolve(__dirname, 'template/'), '.', { overwrite: true });

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies(npmOptions, [
    `@storybook/web-components@${storybookVersion}`,
    ...babelDependencies,
  ]);
};
