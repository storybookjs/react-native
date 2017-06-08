#!/usr/bin/env babel-node

import inquirer from 'inquirer';
import program from 'commander';
import childProcess from 'child_process';

const spawn = childProcess.spawnSync;

program
  .version('1.0.0')
  .option('--all', 'Run all without asking')
  .option('--docs', 'Bootstrap docs')
  .option('--libs', 'Bootstrap libs')
  .option('--test-cra', 'Bootstrap test-cra')
  .option('--react-native-vanilla', 'Bootstrap react-native-vanilla')
  .parse(process.argv);

const todo = {
  docs: false,
  libs: false,
  'test-cra': false,
  'react-native-vanilla': false,
};

if (program.all) {
  Object.assign(todo, {
    docs: true,
    libs: true,
    'test-cra': true,
    'react-native-vanilla': true,
  });
}

if (program.docs) {
  Object.assign(todo, {
    docs: true,
  });
}
if (program.libs) {
  Object.assign(todo, {
    libs: true,
  });
}
if (program['test-cra']) {
  Object.assign(todo, {
    'test-cra': true,
  });
}
if (program['react-native-vanilla']) {
  Object.assign(todo, {
    'react-native-vanilla': true,
  });
}

let selection;
if (!Object.keys(todo).map(key => todo[key]).filter(Boolean).length) {
  selection = inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select which packages to bootstrap',
        name: 'todo',
        choices: Object.keys(todo).map(key => ({ name: key })),
      },
    ])
    .then(answers => answers.todo);
} else {
  selection = Promise.resolve(Object.keys(todo).filter(key => todo[key] === true));
}

selection.then(list => {
  if (list.length === 0) {
    console.log('Nothing to bootstrap');
  } else {
    console.log(`Bootstrapping: ${list.join(', ')}`);
    list.forEach(key => {
      spawn('npm', [`run bootstrap:${key}`], {
        shell: true,
        stdio: 'inherit',
      });
    });
  }
});
