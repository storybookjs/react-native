import path from 'path';
import fs from 'fs';
import types from './project_types';
import { getPackageJson } from './helpers';

export default function detect(options) {
  const packageJson = getPackageJson();
  if (!packageJson) {
    return types.UNDETECTED;
  }

  if (!options.force && packageJson.devDependencies) {
    if (
      packageJson.devDependencies['@storybook/react'] ||
      packageJson.devDependencies['@storybook/react-native'] ||
      packageJson.devDependencies['@storybook/vue'] ||
      packageJson.devDependencies['@storybook/angular']
    ) {
      return types.ALREADY_HAS_STORYBOOK;
    }

    if (
      packageJson.devDependencies['@kadira/storybook'] ||
      packageJson.devDependencies['@kadira/react-native-storybook']
    ) {
      return types.UPDATE_PACKAGE_ORGANIZATIONS;
    }
  }

  if (fs.existsSync(path.resolve('.meteor'))) {
    return types.METEOR;
  }

  if (
    packageJson.devDependencies &&
    (packageJson.devDependencies['vue-loader'] || packageJson.devDependencies.vueify)
  ) {
    return types.SFC_VUE;
  }

  if (
    (packageJson.dependencies && packageJson.dependencies.vue) ||
    (packageJson.devDependencies && packageJson.devDependencies.vue) ||
    (packageJson.dependencies && packageJson.dependencies.nuxt) ||
    (packageJson.devDependencies && packageJson.devDependencies.nuxt)
  ) {
    return types.VUE;
  }

  if (
    (packageJson.dependencies && packageJson.dependencies['react-scripts']) ||
    (packageJson.devDependencies && packageJson.devDependencies['react-scripts'])
  ) {
    return types.REACT_SCRIPTS;
  }

  if (
    ((packageJson.devDependencies && packageJson.devDependencies.webpack) ||
      (packageJson.dependencies && packageJson.dependencies.webpack)) &&
    ((packageJson.devDependencies && packageJson.devDependencies.react) ||
      (packageJson.dependencies && packageJson.dependencies.react))
  ) {
    return types.WEBPACK_REACT;
  }

  if (packageJson.peerDependencies && packageJson.peerDependencies.react) {
    return types.REACT_PROJECT;
  }

  if (
    (packageJson.dependencies && packageJson.dependencies['react-native-scripts']) ||
    (packageJson.devDependencies && packageJson.devDependencies['react-native-scripts'])
  ) {
    return types.REACT_NATIVE_SCRIPTS;
  }

  if (packageJson.dependencies && packageJson.dependencies['react-native']) {
    return types.REACT_NATIVE;
  }

  if (
    (packageJson.dependencies && packageJson.dependencies.react) ||
    (packageJson.devDependencies && packageJson.devDependencies.react)
  ) {
    return types.REACT;
  }

  if (
    (packageJson.dependencies && packageJson.dependencies['@angular/core']) ||
    (packageJson.devDependencies && packageJson.devDependencies['@angular/core'])
  ) {
    return types.ANGULAR;
  }

  return types.UNDETECTED;
}
