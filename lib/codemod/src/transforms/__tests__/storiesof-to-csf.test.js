import fs from 'fs';
import path from 'path';

import { defineTest } from 'jscodeshift/dist/testUtils';

jest.mock('@storybook/node-logger');

fs.readdirSync(path.resolve(__dirname, '../__testfixtures__/storiesof-to-csf'))
  .map(filename => filename.match(/^(.*)\.input\.js$/))
  .filter(Boolean)
  .map(match => match[1])
  .forEach(testName => {
    defineTest(__dirname, `storiesof-to-csf`, null, `storiesof-to-csf/${testName}`);
  });
