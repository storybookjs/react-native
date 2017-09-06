#!/usr/bin/env node
const inquirer = require('inquirer');
const program = require('commander');
const childProcess = require('child_process');
const chalk = require('chalk');
const log = require('npmlog');

const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

const isTgz = source => lstatSync(source).isFile() && source.match(/.tgz$/);
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isTgz);

log.heading = 'storybook';
const prefix = 'bootstrap';
log.addLevel('aborted', 3001, { fg: 'red', bold: true });

const spawn = command => {
  const out = childProcess.spawnSync(`${command}`, {
    shell: true,
    stdio: 'inherit',
  });

  if (out.status !== 0) {
    process.exit(out.status);
  }
  return out;
};

const main = program
  .version('3.0.0')
  .option('--all', `Bootstrap everything ${chalk.gray('(all)')}`);

const createTask = ({ defaultValue, option, name, check = () => true, command, pre = [] }) => ({
  value: false,
  defaultValue: defaultValue || false,
  option: option || undefined,
  name: name || 'unnamed task',
  check: check || (() => true),
  command: () => {
    // run all pre tasks
    // eslint-disable-next-line no-use-before-define
    pre.map(key => tasks[key]).forEach(task => {
      if (!task.check()) {
        task.command();
      }
    });

    log.info(prefix, name);
    command();
  },
});

const tasks = {
  reset: createTask({
    name: `Clean and re-install root dependencies ${chalk.red('(reset)')}`,
    defaultValue: false,
    option: '--reset',
    command: () => {
      log.info(prefix, 'git clean');
      spawn('git clean -fdx --exclude=".vscode" --exclude=".idea"');
      log.info(prefix, 'yarn install');
      spawn('yarn install --no-lockfile');
    },
  }),
  core: createTask({
    name: `Core & Examples ${chalk.gray('(core)')}`,
    defaultValue: true,
    option: '--core',
    command: () => {
      spawn('yarn bootstrap:core');
    },
  }),
  docs: createTask({
    name: `Documentation ${chalk.gray('(docs)')}`,
    defaultValue: false,
    option: '--docs',
    command: () => {
      spawn('yarn bootstrap:docs');
    },
  }),
  packs: createTask({
    name: `Build tarballs of packages ${chalk.gray('(build-packs)')}`,
    defaultValue: false,
    option: '--packs',
    command: () => {
      spawn('yarn build-packs');
    },
    check: () => getDirectories(join(__dirname, '..', 'packs')).length > 0,
  }),
  'react-native-vanilla': createTask({
    name: `React-Native example ${chalk.gray('(react-native-vanilla)')}`,
    defaultValue: false,
    option: '--reactnative',
    pre: ['packs'],
    command: () => {
      spawn('yarn bootstrap:react-native-vanilla');
    },
  }),
  'crna-kitchen-sink': createTask({
    name: `React-Native-App example ${chalk.gray('(crna-kitchen-sink)')}`,
    defaultValue: false,
    option: '--reactnativeapp',
    pre: ['packs'],
    command: () => {
      spawn('yarn bootstrap:crna-kitchen-sink');
    },
  }),
};

Object.keys(tasks)
  .reduce((acc, key) => acc.option(tasks[key].option, tasks[key].name), main)
  .parse(process.argv);

Object.keys(tasks).forEach(key => {
  tasks[key].value = program[tasks[key].option.replace('--', '')] || program.all;
});

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
        message: 'Select which packages to bootstrap',
        name: 'todo',
        choices: Object.keys(tasks).map(key => ({
          name: tasks[key].name,
          checked: tasks[key].defaultValue,
        })),
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
              message: `${chalk.red('DESTRUCTIVE')} files not present in git ${chalk.underline(
                'will get deleted'
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
      list.forEach(key => {
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
