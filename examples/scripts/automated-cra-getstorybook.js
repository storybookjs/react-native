#!/usr/bin/env node

/* eslint-disable */
/* This is an automated install of create-react-app & getstorybook */

const { exec } = require('child-process-promise');
const rimraf = require('rimraf');

const targetFolder = 'automated-cra-getstorybook';

const cleanDir = () => new Promise(resolve => rimraf(`./${targetFolder}`, resolve));

const craInstaller = () => exec('npm install create-react-app');
const craBoot = () => exec(`create-react-app ${targetFolder}`);

const storybookBoot = () => exec(`cd ${targetFolder} && getstorybook`);
const storybookBuild = () => exec(`cd ${targetFolder} && npm run build-storybook`);

Promise.all([craInstaller(), cleanDir()])
  .then(craBoot)
  .then(storybookBoot)
  .then(storybookBuild)
  .catch(error => {
    console.log('rejected: ', error);
  });
