var types = require('./project_types.js');
var helpers = require('./helpers');

module.exports = function detect(options) {
  var packageJson = helpers.getPackageJson();
  if (!packageJson) {
    return types.UNDETECTED;
  }

  if (
    !options.force &&
    packageJson.devDependencies &&
    (
      packageJson.devDependencies['@kadira/storybook'] ||
      packageJson.devDependencies['@kadira/react-native-storybook']
    )
  ) {
    return types.ALREADY_HAS_STORYBOOK;
  }

  if (
    packageJson.devDependencies &&
    packageJson.devDependencies['react-scripts']
  ) {
    return types.REACT_SCRIPTS;
  }

  if (
    packageJson.devDependencies &&
    packageJson.devDependencies.webpack
  ) {
    return types.WEBPACK_REACT;
  }

  if (
    packageJson.peerDependencies &&
    packageJson.peerDependencies.react
  ) {
    return types.REACT_PROJECT;
  }

  if (
    packageJson.dependencies &&
    packageJson.dependencies['react-native']
  ) {
    return types.REACT_NATIVE;
  }

  if (
    packageJson.dependencies &&
    packageJson.dependencies.react
  ) {
    return types.REACT;
  }

  return types.UNDETECTED;
};
