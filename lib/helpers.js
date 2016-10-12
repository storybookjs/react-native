var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var logger = console;
var spawnSync = require('spawn-sync');

exports.getPackageJson = function getPackageJson() {
  var packageJsonPath = path.resolve('package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  var jsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(jsonContent);
};

exports.writePackageJson = function writePackageJson(packageJson) {
  var content = JSON.stringify(packageJson, null, 2) + '\n';
  var packageJsonPath = path.resolve('package.json');

  fs.writeFileSync(packageJsonPath, content, 'utf8');
};

exports.commandLog = function commandLog(message) {
  process.stdout.write(chalk.cyan(' • ') + message);
  var done = function (errorMessage, errorInfo) {
    if (errorMessage) {
      process.stdout.write('. ' + chalk.red('✖') + '\n');
      logger.error('\n     ' + chalk.red(errorMessage));

      if (!errorInfo) return;

      var newErrorInfo = errorInfo
        .split('\n')
        .map(function (line) {
          return '     ' + chalk.dim(line);
        })
        .join('\n');
      logger.error(newErrorInfo + '\n');
      return;
    }

    process.stdout.write('. ' + chalk.green('✓') + '\n');
  };

  return done;
};

exports.paddedLog = function (message) {
  var newMessage = message
    .split('\n')
    .map(function (line) {
      return '    ' + line;
    })
    .join('\n');

  logger.log(newMessage);
};

exports.getChars = function getChars(char, amount) {
  var line = '';
  for (var lc = 0; lc < amount; lc++) {
    line += char;
  }

  return line;
};

exports.codeLog = function codeLog(codeLines, leftPadAmount) {
  var maxLength = 0;
  var newLines = codeLines
    .map(function (line) {
      maxLength = (line.length > maxLength) ? line.length : maxLength;
      return line;
    });

  var finalResult = newLines
    .map(function (line) {
      var rightPadAmount = maxLength - line.length;
      var newLine = line + exports.getChars(' ', rightPadAmount);
      newLine = exports.getChars(' ', leftPadAmount || 2) + chalk.inverse(' ' + newLine + ' ');
      return newLine;
    })
    .join('\n');

  logger.log(finalResult);
};

exports.installDeps = function (options) {
  var done = exports.commandLog('Preparing to install dependencies');
  done();
  console.log();

  var result;
  if (options.useYarn) {
    result = spawnSync('yarn', { stdio: 'inherit' });
  } else {
    result = spawnSync('npm', ['install'], { stdio: 'inherit' });
  }

  console.log();
  done = exports.commandLog('Installing dependencies');
  if (result.status !== 0) {
    done('An error occured while installing dependencies`.');
    process.exit(1);
  }
  done();
};
