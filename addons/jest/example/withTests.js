// ---> import { withTests } from 'storybook-addon-jest';
import withTests from '../dist';

import jestTestResuls from './.jest-test-results.json';


export default withTests(jestTestResuls, {
  filesExt: '.test.js',
});
