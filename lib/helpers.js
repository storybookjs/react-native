var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var sh = require('shelljs');

exports.getPackageJson = function getPackageJson() {
  var packageJsonPath = path.resolve('package.json');
  if(!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(jsonContent);
};

exports.writePackageJson = function writePackageJson(packageJson) {
  var content = JSON.stringify(packageJson, null, 2) + '\n';
  var packageJsonPath = path.resolve('package.json');

  fs.writeFileSync(packageJsonPath, content, 'utf8');
};

exports.commandLog = function commandLog(message) {
  process.stdout.write(chalk.cyan(' • ') + message);
  var done = function(errorMessage, errorInfo) {
    if (errorMessage) {
      process.stdout.write('. ' + chalk.red('✖') + '\n');
      console.error('\n     ' + chalk.red(errorMessage));

      if (!errorInfo) return;

      errorInfo = errorInfo
        .split('\n')
        .map(function(line) {
          return '     ' + chalk.dim(line);
        })
        .join('\n');
      console.error(errorInfo + '\n');
      return;
    }

    process.stdout.write('. ' + chalk.green('✓') + '\n');
  };

  return done;
};

exports.getChars = function getChars(char, amount) {
  var line = '';
  for(var lc=0; lc<amount; lc++) {
    line += char;
  }

  return line;
}

exports.codeLog = function codeLog(codeLines, leftPadAmount) {
  leftPadAmount = leftPadAmount || 2;
  var maxLength = 0;
  var newLines = codeLines
    .map(function(line) {
      maxLength = (line.length > maxLength)? line.length : maxLength;
      return line;
    });

  var finalResult = newLines
    .map(function(line) {
      var rightPadAmount = maxLength - line.length;
      line = line + exports.getChars(' ', rightPadAmount);
      line = exports.getChars(' ', leftPadAmount) + chalk.inverse(' ' + line + ' ');
      return line;
    })
    .join('\n');

  console.log(finalResult);
};

exports.installNpmDeps = function() {
  var done = exports.commandLog('Installing NPM dependencies');
  var result = sh.exec('npm install', { silent: true });
  if (result.code !== 0) {
    done('An error occured while running `npm install`.', result.stderr);
    process.exit(1);
  }
  done();
};
