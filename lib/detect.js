var types = require('./project_types.js');
var helpers = require('./helpers');

module.exports = function() {
  var packageJson = helpers.getPackageJson();
  if (!packageJson) {
    return types.UNDETECTED;
  }

  if(
    packageJson.devDependencies &&
    packageJson.devDependencies['react-scripts']
  ) {
    return types.REACT_SCRIPTS;
  }

  if(
    packageJson.peerDependencies &&
    packageJson.peerDependencies['react']
  ) {
    return types.REACT_PROJECT;
  }

  if(
    packageJson.dependencies &&
    packageJson.dependencies['react-native']
  ) {
    return types.REACT_NATIVE;
  }

  if(
    packageJson.dependencies &&
    packageJson.dependencies['react']
  ) {
    return types.REACT;
  }
};
