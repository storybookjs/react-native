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

const bootstrapOptions = {
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
  'build-packs': {
    value: false,
    name: `Build tarballs of packages ${chalk.gray('(build-packs)')}`,
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

Object.keys(bootstrapOptions).forEach(key => {
  bootstrapOptions[key].value = program[key] || program.all;
});

let selection;
if (!Object.keys(bootstrapOptions).map(key => bootstrapOptions[key].value).filter(Boolean).length) {
  selection = inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select which packages to bootstrap',
        name: 'todo',
        choices: Object.keys(bootstrapOptions).map(key => ({
          name: bootstrapOptions[key].name,
          checked: bootstrapOptions[key].default,
        })),
      },
    ])
    .then(answers =>
      answers.todo.map(name =>
        Object.keys(bootstrapOptions).find(i => bootstrapOptions[i].name === name)
      )
    );
} else {
  selection = Promise.resolve(
    Object.keys(bootstrapOptions).filter(key => bootstrapOptions[key].value === true)
  );
}

selection.then(list => {
  if (list.length === 0) {
    log.warn(prefix, 'Nothing to bootstrap');
  } else {
    list.forEach(key => {
      if (list.length > 1) {
        log.info(prefix, `Bootstrapping: ${bootstrapOptions[key].name}`);
      }
      spawn('yarn', [`bootstrap:${key}`, '-s'], {
        shell: true,
        stdio: 'inherit',
      });
    });
  }
});
