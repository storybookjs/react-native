const types = require('./project_types.js');
const helpers = require('./helpers');
const path = require('path');
const fs = require('fs');

module.exports = function detect(options) {
  const packageJson = helpers.getPackageJson();
  if (!packageJson) {
    return types.UNDETECTED;
  }

  if (!options.force && packageJson.devDependencies) {
    if (
      packageJson.devDependencies['@storybook/react'] ||
      packageJson.devDependencies['@storybook/react-native'] ||
      packageJson.devDependencies['@storybook/vue']
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
    (packageJson.devDependencies && packageJson.devDependencies.vue)
  ) {
    return types.VUE;
  }

  if (packageJson.devDependencies && packageJson.devDependencies['react-scripts']) {
    return types.REACT_SCRIPTS;
  }

  if (packageJson.devDependencies && packageJson.devDependencies.webpack) {
    return types.WEBPACK_REACT;
  }

  if (packageJson.peerDependencies && packageJson.peerDependencies.react) {
    return types.REACT_PROJECT;
  }

  if (packageJson.devDependencies && packageJson.devDependencies['react-native-scripts']) {
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

  return types.UNDETECTED;
};
