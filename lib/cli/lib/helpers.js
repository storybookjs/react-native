const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const spawnSync = require('cross-spawn').sync;

const logger = console;

exports.getPackageJson = function getPackageJson() {
  const packageJsonPath = path.resolve('package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(jsonContent);
};

exports.writePackageJson = function writePackageJson(packageJson) {
  const content = `${JSON.stringify(packageJson, null, 2)}\n`;
  const packageJsonPath = path.resolve('package.json');

  fs.writeFileSync(packageJsonPath, content, 'utf8');
};

exports.commandLog = function commandLog(message) {
  process.stdout.write(chalk.cyan(' • ') + message);
  const done = (errorMessage, errorInfo) => {
    if (errorMessage) {
      process.stdout.write(`. ${chalk.red('✖')}\n`);
      logger.error(`\n     ${chalk.red(errorMessage)}`);

      if (!errorInfo) return;

      const newErrorInfo = errorInfo
        .split('\n')
        .map(line => `     ${chalk.dim(line)}`)
        .join('\n');
      logger.error(`${newErrorInfo}\n`);
      return;
    }

    process.stdout.write(`. ${chalk.green('✓')}\n`);
  };

  return done;
};

exports.paddedLog = function paddedLog(message) {
  const newMessage = message
    .split('\n')
    .map(line => `    ${line}`)
    .join('\n');

  logger.log(newMessage);
};

exports.getChars = function getChars(char, amount) {
  let line = '';
  for (let lc = 0; lc < amount; lc++) { // eslint-disable-line
    line += char;
  }

  return line;
};

exports.codeLog = function codeLog(codeLines, leftPadAmount) {
  let maxLength = 0;
  const newLines = codeLines.map(line => {
    maxLength = line.length > maxLength ? line.length : maxLength;
    return line;
  });

  const finalResult = newLines
    .map(line => {
      const rightPadAmount = maxLength - line.length;
      let newLine = line + exports.getChars(' ', rightPadAmount);
      newLine = exports.getChars(' ', leftPadAmount || 2) + chalk.inverse(` ${newLine} `);
      return newLine;
    })
    .join('\n');

  logger.log(finalResult);
};

exports.installDeps = function installDeps(options) {
  let done = exports.commandLog('Preparing to install dependencies');
  done();
  logger.log();

  let result;
  if (options.useYarn) {
    result = spawnSync('yarn', { stdio: 'inherit' });
  } else {
    result = spawnSync('npm', ['install'], { stdio: 'inherit' });
  }

  logger.log();
  done = exports.commandLog('Installing dependencies');
  if (result.status !== 0) {
    done('An error occurred while installing dependencies.');
    process.exit(1);
  }
  done();
};
