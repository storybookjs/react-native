const path = require('path');
const fs = require('fs-extra');
const fse = require('fs-extra');
const shell = require('shelljs');
const glob = require('glob');
const symlink = require('symlink-dir');
const log = require('npmlog');

const targetPath = path.join(__dirname, '..', 'node_modules', '@storybook');
const prefix = 'hoist-internals';
const cwd = path.join(__dirname, '..');

log.heading = 'lerna+';
log.addLevel('success', 3001, { fg: 'green', bold: true });
log.info(prefix, 'Hoisting internal packages');

const getLernaPackages = () =>
  fse.readJson(path.join(__dirname, '..', 'lerna.json')).then(json => json.packages);
const passingLog = fn => i => {
  fn(i);
  return i;
};
const getPackageOfFolder = sourcePath => fse.readJsonSync(path.join(sourcePath, 'package.json'));

const task = getLernaPackages()
  .then(
    passingLog(packages => {
      log.verbose(prefix, 'working dir paths: %j', cwd);
      log.verbose(prefix, 'source paths: %j', packages);
      log.verbose(prefix, 'target paths: %j', targetPath);
    })
  )
  .then(packages => `@(${packages.map(s => s.replace('/*', '')).join('|')})/*/`)
  .then(
    passingLog(pattern => {
      log.silly(prefix, 'pattern to look for packages: %j', pattern);
    })
  )
  .then(
    pattern =>
      new Promise((resolve, reject) => {
        glob(pattern, { cwd }, (error, results) => (error ? reject(error) : resolve(results)));
      })
  )
  .then(results =>
    Promise.all(
      results
        .map(sourcePath => path.resolve(fs.realpathSync(sourcePath)))
        .reduce((acc, item) => {
          if (!acc.includes(item)) {
            acc.push(item);
          }
          return acc;
        }, [])
        .map(
          passingLog(item => {
            log.silly(prefix, 'found package path', item);
          })
        )
        .map(sourcePath => ({
          sourcePath,
          packageJson: getPackageOfFolder(sourcePath),
        }))
        .filter(({ packageJson }) => !packageJson.private)
        .map(({ sourcePath, packageJson }) =>
          Promise.resolve(packageJson.name.replace('@storybook/', ''))
            .then(packageName => {
              log.silly(prefix, 'found package name', packageName);
              return path.join(targetPath, packageName);
            })
            .then(localTargetPath =>
              fse
                .remove(localTargetPath)
                .then(() => symlink(sourcePath, localTargetPath))
                .then(
                  passingLog(() => {
                    log.silly(prefix, 'symlinked ', [sourcePath, localTargetPath]);
                  })
                )
                .then(() => localTargetPath)
                .catch(error => {
                  log.error(prefix, 'symlink', error, [sourcePath, localTargetPath]);
                  throw new Error('failed symlink');
                })
            )
        )
    )
  )
  .then(locations =>
    Promise.all(
      locations
        .map(location => path.join(location, 'node_modules', '@storybook'))
        .map(
          passingLog(removePath => {
            log.verbose(prefix, 'removing ', removePath);
          })
        )
        .map(removePath => shell.rm('-rf', removePath))
        .map(
          (item, index) =>
            item.code === 0 ? Promise.resolve(locations[index]) : Promise.reject(item)
        )
    )
  );

task
  .then(packages => {
    log.info(prefix, packages.map(dir => dir.replace(cwd, '')).join(',\n'));
    log.success(prefix, 'complete');
  })
  .catch(error => {
    log.error(prefix, 'failed', error);
    shell.exit(1);
  });
