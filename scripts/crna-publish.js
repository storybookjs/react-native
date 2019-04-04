#!/usr/bin/env node
const childProcess = require('child_process');
const log = require('npmlog');

const getCurrentBranch = () =>
  childProcess
    .execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();

const sanitizeBranchName = branch => branch.replace(/[^a-zA-Z0-9-_]/g, '-');

const expoLogin = (username, password) => {
  log.info('Logging in to expo');
  childProcess.execSync(`yarn expo login -u '${username}' -p '${password}'`);
};

const expoLogout = () => {
  log.verbose('Logging out from expo');
  childProcess.execSync('yarn expo logout');
};

const expoPublish = channel => {
  log.info(`Publishing to channel ${channel}`);
  childProcess.execSync(`yarn publish:crna --release-channel=${channel}`);
  log.info(
    `crna-kitchen-sink app available at https://exp.host/@storybook/crna-kitchen-sink?release-channel=${channel}`
  );
};

const username = process.env.EXPO_USERNAME;
const password = process.env.EXPO_PASSWORD;

if (!username) {
  log.error('EXPO_USERNAME environment variable not set');
  // 0 exit code because builds from forks will not have this variable set
  process.exit(0);
}

if (!password) {
  log.error('EXPO_PASSWORD environment variable not set');
  // 0 exit code because builds from forks will not have this variable set
  process.exit(0);
}

expoLogout();
expoLogin(username, password);
expoPublish(sanitizeBranchName(getCurrentBranch()));
expoLogout();
