import { fail, danger } from 'danger';
import { execSync } from 'child_process';

execSync('npm install lodash');

const { flatten, intersection, isEmpty } = require('lodash');

const pkg = require('../../package.json'); // eslint-disable-line import/newline-after-import
const prLogConfig = pkg['pr-log'];

const Versions = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const branchVersion = Versions.MINOR;

const checkRequiredLabels = labels => {
  const forbiddenLabels = flatten([
    'do not merge',
    'in progress',
    branchVersion !== Versions.MAJOR ? 'BREAKING CHANGE' : [],
    branchVersion === Versions.PATCH ? 'feature request' : [],
  ]);

  const requiredLabels = flatten([prLogConfig.skipLabels || [], (prLogConfig.validLabels || []).map(keyVal => keyVal[0])]);

  const blockingLabels = intersection(forbiddenLabels, labels);
  if (!isEmpty(blockingLabels)) {
    fail(`PR is marked with ${blockingLabels.map(label => `"${label}"`).join(', ')} label${blockingLabels.length > 1 ? 's' : ''}.`);
  }

  const foundLabels = intersection(requiredLabels, labels);
  if (isEmpty(foundLabels)) {
    fail(`PR is not labeled with one of: ${JSON.stringify(requiredLabels)}`);
  } else if (foundLabels.length > 1) {
    fail(`Please choose only one of these labels: ${JSON.stringify(foundLabels)}`);
  }
};

if (prLogConfig) {
  const { labels } = danger.github.issue;
  checkRequiredLabels(labels.map(l => l.name));
}
