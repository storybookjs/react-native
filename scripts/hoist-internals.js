const path = require('path');
const fs = require('fs-extra');
const fse = require('fs-extra');
const shell = require('shelljs');
const chalk = require('chalk');
const glob = require('glob');
const symlink = require('symlink-dir');

const targetPath = path.join(__dirname, '..', 'node_modules', '@storybook');

const task = fse
  .readJson(path.join(__dirname, '..', 'lerna.json'))
  .then(json => {
    const { packages, lerna } = json;
    shell.echo(chalk.gray('\n=> Hoisting internal packages'));
    shell.echo(chalk.gray(`\n=> lerna version: ${lerna}`));
    shell.echo(chalk.gray(`\n=> source paths: ${packages.join(', ')}`));
    shell.echo(chalk.gray(`\n=> target path: ${targetPath}`));
    return json;
  })
  .then(
    ({ packages }) =>
      new Promise((resolve, reject) => {
        const pattern = `@(${packages.map(s => s.replace('/*', '')).join('|')})/*`;
        const cwd = path.join(__dirname, '..');
        glob(pattern, { cwd }, (error, results) => (error ? reject(error) : resolve(results)));
      })
  )
  .then(results =>
    Promise.all(
      results
        .map(sourcePath => path.resolve(fs.realpathSync(sourcePath)))
        .map(i => console.log(i) || i)
        .reduce((acc, item) => {
          if (!acc.includes(item)) {
            acc.push(item);
          }
          return acc;
        }, [])
        .map(sourcePath =>
          fse
            .readJson(path.join(sourcePath, 'package.json'))
            .then(json => json.name.replace('@storybook/', ''))
            .then(packageName => {
              const localTargetPath = path.join(targetPath, packageName);
              return symlink(sourcePath, localTargetPath)
                .catch(error => console.log('ERROR symlink', error))
                .then(() => sourcePath);
            })
        )
    )
  )
  .then(locations =>
    Promise.all(
      locations
        .map(location => {
          const removePath = path.join(location, 'node_modules', '@storybook');
          console.log(removePath);
          return shell.rm('-rf', removePath);
        })
        .map(
          (item, index) =>
            item.code === 0 ? Promise.resolve(locations[index]) : Promise.reject(item)
        )
    )
  );

task
  .then(() => {
    shell.echo(chalk.green('COMPLETE'), chalk.gray('=> Hoisting internal packages'));
  })
  .catch(() => {
    shell.echo(chalk.red('FAIL'), chalk.gray('=> Hoisting internal packages'));
  });
