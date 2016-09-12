import Jasmine from 'jasmine';
import path from 'path';
const jasmine = new Jasmine();
var SpecReporter = require('jasmine-spec-reporter');

export const run = () => {
  /* eslint-disable camelcase */
  jasmine.loadConfig({
    spec_dir: path.relative(process.cwd(), __dirname),
    spec_files: [
      'story_tests.js',
    ],
  });
  /* eslint-enable camelcase */

  jasmine.addReporter(new SpecReporter());

  console.log('storyspecs');

  jasmine.execute();
};

