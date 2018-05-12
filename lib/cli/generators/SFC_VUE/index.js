import mergeDirs from 'merge-dirs';
import path from 'path';
import {
  getVersions,
  getPackageJson,
  writePackageJson,
  getBabelRc,
  writeBabelRc,
} from '../../lib/helpers';

export default async npmOptions => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    addonsVersion,
    babelCoreVersion,
    babelPresetVersion,
  ] = await getVersions(
    npmOptions,
    '@storybook/vue',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'babel-core',
    'babel-preset-vue'
  );

  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/vue'] = storybookVersion;
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;
  packageJson.devDependencies['@storybook/addons'] = addonsVersion;

  if (!packageJson.dependencies['babel-core'] && !packageJson.devDependencies['babel-core']) {
    packageJson.devDependencies['babel-core'] = babelCoreVersion;
  }
  packageJson.devDependencies['babel-preset-vue'] = babelPresetVersion;

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelRc = getBabelRc() || {
    presets: [['env', { modules: false }]],
  };
  const hasPreset = babelRc.presets.find(
    preset =>
      (Array.isArray(preset) && preset[0] === 'vue') ||
      (typeof preset === 'string' && preset === 'vue')
  );
  if (!hasPreset) {
    babelRc.presets.push('vue');
  }

  writeBabelRc(babelRc);
};
