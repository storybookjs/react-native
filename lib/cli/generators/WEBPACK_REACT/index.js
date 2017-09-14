import mergeDirs from 'merge-dirs';
import path from 'path';
import { getPackageJson, writePackageJson } from '../../lib/helpers';
import { devDependencies } from '../../package.json';

export default async () => {
  const storybookVersion = devDependencies['@storybook/react'];
  const actionsVersion = devDependencies['@storybook/addon-actions'];
  const linksVersion = devDependencies['@storybook/addon-links'];

  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/react'] = storybookVersion;
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
