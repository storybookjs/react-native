#!/usr/bin/env node

/* eslint-disable global-require, no-octal-escape */
const childProcess = require('child_process');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

const logger = console;

let cooldown = 0;

try {
  require('inquirer');
  require('commander');
  require('chalk');
  require('npmlog');
} catch (e) {
  logger.log('🕘 running bootstrap on a clean repo, we have to install dependencies');
  childProcess.spawnSync('yarn', ['install', '--ignore-optional'], {
    stdio: ['inherit', 'inherit', 'inherit'],
  });
  process.stdout.write('\x07');
  process.stdout.write('\033c');

  // give the filesystem some time
  cooldown = 1000;
} finally {
  setTimeout(run, cooldown);
}

function run() {
  const inquirer = require('inquirer');
  const program = require('commander');
  const chalk = require('chalk');
  const log = require('npmlog');

  const isTgz = source => lstatSync(source).isFile() && source.match(/.tgz$/);
  const getDirectories = source =>
    readdirSync(source)
      .map(name => join(source, name))
      .filter(isTgz);

  log.heading = 'storybook';
  const prefix = 'bootstrap';
  log.addLevel('aborted', 3001, { fg: 'red', bold: true });

  const spawn = (command, options = {}) => {
    const out = childProcess.spawnSync(
      `${command}`,
      Object.assign(
        {
          shell: true,
          stdio: 'inherit',
        },
        options
      )
    );

    if (out.status !== 0) {
      process.exit(out.status);
    }
    return out;
  };

  const main = program
    .version('5.0.0')
    .option('--all', `Bootstrap everything ${chalk.gray('(all)')}`);

  const createTask = ({
    defaultValue,
    option,
    name,
    check = () => true,
    command,
    pre = [],
    order,
  }) => ({
    value: false,
    defaultValue: defaultValue || false,
    option: option || undefined,
    name: name || 'unnamed task',
    check: check || (() => true),
    order,
    command: () => {
      // run all pre tasks
      pre
        .map(key => tasks[key])
        .forEach(task => {
          if (task.check()) {
            task.command();
          }
        });

      log.info(prefix, name);
      command();
    },
  });

  const tasks = {
    core: createTask({
      name: `Core, Dll & Examples ${chalk.gray('(core)')}`,
      defaultValue: true,
      option: '--core',
      command: () => {
        log.info(prefix, 'yarn workspace');
      },
      pre: ['install', 'build', 'dll'],
      order: 1,
    }),
    reset: createTask({
      name: `Clean repository ${chalk.red('(reset)')}`,
      defaultValue: false,
      option: '--reset',
      command: () => {
        log.info(prefix, 'git clean');
        spawn('node -r esm ./scripts/reset.js');
      },
      order: 0,
    }),
    install: createTask({
      name: `Install dependencies ${chalk.gray('(install)')}`,
      defaultValue: false,
      option: '--install',
      command: () => {
        spawn('yarn install --ignore-optional ');
      },
      order: 1,
    }),
    build: createTask({
      name: `Build packages ${chalk.gray('(build)')}`,
      defaultValue: false,
      option: '--build',
      command: () => {
        log.info(prefix, 'prepare');
        spawn('lerna run prepare');
      },
      order: 2,
    }),
    dll: createTask({
      name: `Generate DLL ${chalk.gray('(dll)')}`,
      defaultValue: false,
      option: '--dll',
      command: () => {
        log.info(prefix, 'dll');
        spawn('lerna run createDlls --scope "@storybook/ui"');
      },
      order: 3,
    }),
    docs: createTask({
      name: `Documentation ${chalk.gray('(docs)')}`,
      defaultValue: false,
      option: '--docs',
      command: () => {
        spawn('yarn bootstrap:docs');
      },
      order: 6,
    }),
    packs: createTask({
      name: `Build tarballs of packages ${chalk.gray('(build-packs)')}`,
      defaultValue: false,
      option: '--packs',
      command: () => {
        spawn('yarn build-packs');
      },
      check: () => getDirectories(join(__dirname, '..', 'packs')).length === 0,
      order: 5,
    }),
    registry: createTask({
      name: `Run local registry ${chalk.gray('(reg)')}`,
      defaultValue: false,
      option: '--reg',
      command: () => {
        spawn('./scripts/run-registry.js');
      },
      order: 11,
    }),
    dev: createTask({
      name: `Run build in watch mode ${chalk.gray('(dev)')}`,
      defaultValue: false,
      option: '--dev',
      command: () => {
        spawn('yarn dev');
      },
      order: 9,
    }),
  };

  const groups = {
    main: ['core', 'docs'],
    buildtasks: ['install', 'build', 'dll', 'packs'],
    devtasks: ['dev', 'registry', 'reset'],
  };

  Object.keys(tasks)
    .reduce((acc, key) => acc.option(tasks[key].option, tasks[key].name), main)
    .parse(process.argv);

  Object.keys(tasks).forEach(key => {
    tasks[key].value = program[tasks[key].option.replace('--', '')] || program.all;
  });

  const createSeperator = input => `- ${input}${' ---------'.substr(0, 12)}`;

  const choices = Object.values(groups)
    .map(l =>
      l.map(key => ({
        name: tasks[key].name,
        checked: tasks[key].defaultValue,
      }))
    )
    .reduce(
      (acc, i, k) =>
        acc.concat(new inquirer.Separator(createSeperator(Object.keys(groups)[k]))).concat(i),
      []
    );

  let selection;
  if (
    !Object.keys(tasks)
      .map(key => tasks[key].value)
      .filter(Boolean).length
  ) {
    selection = inquirer
      .prompt([
        {
          type: 'checkbox',
          message: 'Select the bootstrap activities',
          name: 'todo',
          pageSize: Object.keys(tasks).length + Object.keys(groups).length,
          choices,
        },
      ])
      .then(({ todo }) =>
        todo.map(name => tasks[Object.keys(tasks).find(i => tasks[i].name === name)])
      )
      .then(list => {
        if (list.find(i => i === tasks.reset)) {
          return inquirer
            .prompt([
              {
                type: 'confirm',
                message: `${chalk.red(
                  'DESTRUCTIVE'
                )} deletes node_modules, files not present in git ${chalk.underline(
                  'will get trashed'
                )}, except for .idea and .vscode, ${chalk.cyan('Continue?')}`,
                name: 'sure',
              },
            ])
            .then(({ sure }) => {
              if (sure) {
                return list;
              }
              throw new Error('problem is between keyboard and chair');
            });
        }
        return list;
      });
  } else {
    selection = Promise.resolve(
      Object.keys(tasks)
        .map(key => tasks[key])
        .filter(item => item.value === true)
    );
  }

  selection
    .then(list => {
      if (list.length === 0) {
        log.warn(prefix, 'Nothing to bootstrap');
      } else {
        list
          .sort((a, b) => a.order - b.order)
          .forEach(key => {
            key.command();
          });
        process.stdout.write('\x07');
      }
    })
    .catch(e => {
      log.aborted(prefix, chalk.red(e.message));
      log.silly(prefix, e);
      process.exit(1);
    });
}
