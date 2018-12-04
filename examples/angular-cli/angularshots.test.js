// Needed to prevent "Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten."
import 'core-js/modules/es6.promise';
import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';

jest.mock('./addon-jest.testresults.json', () => ({}), { virtual: true });
jest.mock('environments/environment', () => ({}), { virtual: true });

initStoryshots({
  framework: 'angular',
  integrityOptions: { cwd: path.join(__dirname, 'src', 'stories') },
  configPath: path.join(__dirname, '.storybook'),
  test: multiSnapshotWithOptions(),
});
