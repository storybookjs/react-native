import { fail, danger } from 'danger';
import { flatten, intersection, isEmpty, includes } from 'lodash-es';

const pkg = require('./package.json'); // eslint-disable-line import/newline-after-import
const prLogConfig = pkg['pr-log'];

const checkRequiredLabels = labels => {
  const requiredLabels = flatten([
    prLogConfig.skipLabels || [],
    Object.keys(prLogConfig.validLabels || {}),
  ]);

  if (includes(labels, 'do not merge')) {
    fail('PR is marked with "do not merge" label.');
  }

  const foundLabels = intersection(requiredLabels, labels);
  if (isEmpty(foundLabels)) {
    fail(`PR is not labeled with one of: ${JSON.stringify(requiredLabels)}`);
  }
};

if (prLogConfig) {
  const { labels } = danger.github.issue;
  checkRequiredLabels(labels.map(l => l.name));
}
