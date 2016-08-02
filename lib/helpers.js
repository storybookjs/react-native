var path = require('path');
var fs = require('fs');

exports.getPackageJson = function() {
  var packageJsonPath = path.resolve('package.json');
  if(!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(jsonContent);
};

exports.writePackageJson = function(packageJson) {
  var content = JSON.stringify(packageJson, null, 2) + '\n';
  var packageJsonPath = path.resolve('package.json');

  fs.writeFileSync(packageJsonPath, content, 'utf8');
};
