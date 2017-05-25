const types = require('./project_types.js');
const helpers = require('./helpers');
const path = require('path');
const fs = require('fs');

module.exports = function detect(options) {
  const packageJson = helpers.getPackageJson();
  if (!packageJson) {
    return types.UNDETECTED;
  }

  if (
    !options.force &&
    packageJson.devDependencies &&
    (packageJson.devDependencies['@storybook/react'] ||
      packageJson.devDependencies['@storybook/react-native'])
  ) {
    return types.ALREADY_HAS_STORYBOOK;
  }

  if (fs.existsSync(path.resolve('.meteor'))) {
    return types.METEOR;
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
