#!/usr/bin/env babel-node
import inquirer from 'inquirer';
import program from 'commander';
import childProcess from 'child_process';
import chalk from 'chalk';
import log from 'npmlog';

log.heading = 'storybook';
const prefix = 'bootstrap';

const spawn = childProcess.spawnSync;

program
  .version('3.0.0')
  .option('--all', 'Run all without asking')
  .option('--core', 'Bootstrap core')
  .option('--docs', 'Bootstrap docs')
  .option('--test-cra', 'Bootstrap examples/test-cra')
  .option('--react-native-vanilla', 'Bootstrap examples/react-native-vanilla')
  .parse(process.argv);

const todo = {
  core: {
    value: false,
    name: `Core & Examples ${chalk.gray('(core)')}`,
    default: true,
  },
  docs: {
    value: false,
    name: `Documentation ${chalk.gray('(docs)')}`,
    default: false,
  },
  'test-cra': {
    value: false,
    name: `Realistic installed example ${chalk.gray('(test-cra)')}`,
    default: false,
  },
  'react-native-vanilla': {
    value: false,
    name: `React-Native example ${chalk.gray('(react-native-vanilla)')}`,
    default: false,
  },
};

Object.keys(todo).forEach(key => {
  todo[key].value = program[key] || program.all;
});

let selection;
if (!Object.keys(todo).map(key => todo[key].value).filter(Boolean).length) {
  selection = inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select which packages to bootstrap',
        name: 'todo',
        choices: Object.keys(todo).map(key => ({
          name: todo[key].name,
          checked: todo[key].default,
        })),
      },
    ])
    .then(answers => answers.todo.map(name => Object.keys(todo).find(i => todo[i].name === name)));
} else {
  selection = Promise.resolve(Object.keys(todo).filter(key => todo[key].value === true));
}

selection.then(list => {
  if (list.length === 0) {
    log.warn(prefix, 'Nothing to bootstrap');
  } else {
    list.forEach(key => {
      if (list.length > 1) {
        log.info(prefix, `Bootstrapping: ${todo[key].name}`);
      }
      spawn('yarn', [`bootstrap:${key}`, '-s'], {
        shell: true,
        stdio: 'inherit',
      });
    });
  }
});
