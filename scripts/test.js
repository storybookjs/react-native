#!/usr/bin/env node
const inquirer = require('inquirer');
const program = require('commander');
const childProcess = require('child_process');
const chalk = require('chalk');
const log = require('npmlog');

const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

const isTgz = source => lstatSync(source).isFile() && source.match(/.tgz$/);
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isTgz);

log.heading = 'storybook';
const prefix = 'test';
log.addLevel('aborted', 3001, { fg: 'red', bold: true });

const spawn = command =>
  childProcess.spawnSync(`${command}`, {
    shell: true,
    stdio: 'inherit',
  });

const main = program.version('3.0.0').option('--all', `Test everything ${chalk.gray('(all)')}`);

const createProject = ({ defaultValue, option, name, projectLocation }) => ({
  value: false,
  defaultValue: defaultValue || false,
  option: option || undefined,
  name: name || 'unnamed task',
  projectLocation,
});
const createOption = ({}) => ({});

const tasks = {
  core: createTask({
    name: `Core & React & Vue ${chalk.gray('(core)')}`,
    defaultValue: true,
    option: '--core',
    projectLocation: './',
  }),
  'react-native-vanilla': createTask({
    name: `React-Native example ${chalk.gray('(react-native-vanilla)')}`,
    defaultValue: false,
    option: '--reactnative',
    projectLocation: './examples/react-native-vanilla',
  }),
  'crna-kitchen-sink': createTask({
    name: `React-Native-App example ${chalk.gray('(crna-kitchen-sink)')}`,
    defaultValue: false,
    option: '--reactnativeapp',
    projectLocation: './examples/crna-kitchen-sink',
  }),
  watchmode: createTask({
    name: `Run in watch-mode ${chalk.gray('(watchmode)')}`,
    defaultValue: false,
    option: '--watch',
    projectLocation: false,
    extraParam: '--watch',
  }),
};

Object.keys(tasks)
  .reduce((acc, key) => acc.option(tasks[key].option, tasks[key].name), main)
  .parse(process.argv);

Object.keys(tasks).forEach(key => {
  tasks[key].value = program[tasks[key].option.replace('--', '')] || program.all;
});

let selection;
if (!Object.keys(tasks).map(key => tasks[key].value).filter(Boolean).length) {
  selection = inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select which tests to run',
        name: 'todo',
        choices: Object.keys(tasks)
          .map(key => ({
            name: tasks[key].name,
            checked: tasks[key].defaultValue,
          }))
          .concat([
            new inquirer.Separator(),
            {
              name: 'Run in watchmode',
              checked: false,
            },
          ]),
      },
    ])
    .then(({ todo }) =>
      todo.map(name => tasks[Object.keys(tasks).find(i => tasks[i].name === name)])
    );
} else {
  selection = Promise.resolve(
    Object.keys(tasks).map(key => tasks[key]).filter(item => item.value === true)
  );
}

selection
  .then(list => {
    if (list.length === 0) {
      log.warn(prefix, 'Nothing to test');
    } else {
      // console.log('list', list)
      // console.log(`jest --projects ${list.map(key => key.projectLocation).join(' ')}`);
      spawn(`jest --projects ${list.map(key => key.projectLocation).join(' ')}`);
      process.stdout.write('\x07');
      try {
        spawn('say "Testing sequence complete"');
      } catch (e) {
        // discard error
      }
    }
  })
  .catch(e => {
    log.aborted(prefix, chalk.red(e.message));
    log.silly(prefix, e);
    return true;
  });
