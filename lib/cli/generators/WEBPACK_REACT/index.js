import mergeDirs from 'merge-dirs';
import path from 'path';
import latestVersion from 'latest-version';
import { getPackageJson, writePackageJson } from '../../lib/helpers';

export default Promise.all([
  latestVersion('@storybook/react'),
  latestVersion('@storybook/addon-actions'),
  latestVersion('@storybook/addon-links'),
]).then(([storybookVersion, actionsVersion, linksVersion]) => {
  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/react'] = `^${storybookVersion}`;
  packageJson.devDependencies['@storybook/addon-actions'] = `^${actionsVersion}`;
  packageJson.devDependencies['@storybook/addon-links'] = `^${linksVersion}`;

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
});
