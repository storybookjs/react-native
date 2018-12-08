import path from 'path';
import fs from 'fs';
import types, { supportedFrameworks } from './project_types';
import { getBowerJson, getPackageJson } from './helpers';

function detectFramework(dependencies) {
  if (!dependencies) {
    return false;
  }
  if (
    dependencies.devDependencies &&
    (dependencies.devDependencies['vue-loader'] || dependencies.devDependencies.vueify)
  ) {
    return types.SFC_VUE;
  }

  if (
    (dependencies.dependencies && dependencies.dependencies.vue) ||
    (dependencies.devDependencies && dependencies.devDependencies.vue) ||
    (dependencies.dependencies && dependencies.dependencies.nuxt) ||
    (dependencies.devDependencies && dependencies.devDependencies.nuxt)
  ) {
    return types.VUE;
  }

  if (
    (dependencies.dependencies && dependencies.dependencies['ember-cli']) ||
    (dependencies.devDependencies && dependencies.devDependencies['ember-cli'])
  ) {
    return types.EMBER;
  }

  if (
    (dependencies.dependencies && dependencies.dependencies['react-scripts']) ||
    (dependencies.devDependencies && dependencies.devDependencies['react-scripts']) ||
    // For projects using a custom/forked `react-scripts` package.
    fs.existsSync(path.join(process.cwd(), '/node_modules/.bin/react-scripts'))
  ) {
    return types.REACT_SCRIPTS;
  }

  if (
    ((dependencies.devDependencies && dependencies.devDependencies.webpack) ||
      (dependencies.dependencies && dependencies.dependencies.webpack)) &&
    ((dependencies.devDependencies && dependencies.devDependencies.react) ||
      (dependencies.dependencies && dependencies.dependencies.react))
  ) {
    return types.WEBPACK_REACT;
  }

  if (dependencies.peerDependencies && dependencies.peerDependencies.react) {
    return types.REACT_PROJECT;
  }

  if (
    (dependencies.dependencies && dependencies.dependencies['react-native']) ||
    (dependencies.dependencies && dependencies.dependencies['react-native-scripts']) ||
    (dependencies.devDependencies && dependencies.devDependencies['react-native-scripts'])
  ) {
    return types.REACT_NATIVE;
  }

  if (
    (dependencies.dependencies && dependencies.dependencies.react) ||
    (dependencies.devDependencies && dependencies.devDependencies.react)
  ) {
    return types.REACT;
  }

  if (
    (dependencies.dependencies && dependencies.dependencies['@angular/core']) ||
    (dependencies.devDependencies && dependencies.devDependencies['@angular/core'])
  ) {
    return types.ANGULAR;
  }

  if (
    (dependencies.dependencies && dependencies.dependencies['@polymer/polymer']) ||
    (dependencies.devDependencies && dependencies.devDependencies['@polymer/polymer']) ||
    (dependencies.dependencies && dependencies.dependencies.polymer) ||
    (dependencies.devDependencies && dependencies.devDependencies.polymer)
  ) {
    return types.POLYMER;
  }

  if (
    (dependencies.dependencies && dependencies.dependencies.mithril) ||
    (dependencies.devDependencies && dependencies.devDependencies.mithril)
  ) {
    return types.MITHRIL;
  }

  if (
    (dependencies.dependencies && dependencies.dependencies.marko) ||
    (dependencies.devDependencies && dependencies.devDependencies.marko)
  ) {
    return types.MARKO;
  }

  if (
    (dependencies.dependencies && dependencies.dependencies.riot) ||
    (dependencies.devDependencies && dependencies.devDependencies.riot)
  ) {
    return types.RIOT;
  }

  return false;
}

export function isStorybookInstalled(dependencies, force) {
  if (!dependencies) {
    return false;
  }

  if (!force && dependencies.devDependencies) {
    if (
      supportedFrameworks.reduce(
        (storybookPresent, framework) =>
          storybookPresent || dependencies.devDependencies[`@storybook/${framework}`],
        false
      )
    ) {
      return types.ALREADY_HAS_STORYBOOK;
    }

    if (
      dependencies.devDependencies['@kadira/storybook'] ||
      dependencies.devDependencies['@kadira/react-native-storybook']
    ) {
      return types.UPDATE_PACKAGE_ORGANIZATIONS;
    }
  }
  return false;
}

export default function detect(options) {
  if (options.html) {
    return types.HTML;
  }

  const packageJson = getPackageJson();
  const bowerJson = getBowerJson();

  if (!packageJson && !bowerJson) {
    return types.UNDETECTED;
  }

  if (fs.existsSync(path.resolve('.meteor'))) {
    return types.METEOR;
  }

  const storyBookInstalled = isStorybookInstalled(packageJson, options.force);
  if (storyBookInstalled) {
    return storyBookInstalled;
  }

  return detectFramework(packageJson) || detectFramework(bowerJson) || types.UNDETECTED;
}
