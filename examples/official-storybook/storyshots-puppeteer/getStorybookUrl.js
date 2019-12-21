import path from 'path';
import fs from 'fs';
import { logger } from '@storybook/node-logger';

export default function getStorybookUrl() {
  if (process.env.USE_DEV_SERVER) {
    return 'http://localhost:9011';
  }

  const pathToStorybookStatic = path.join(__dirname, '../', 'storybook-static');
  if (!fs.existsSync(pathToStorybookStatic)) {
    logger.error(
      'You are running puppeteer tests without having the static build of storybook. Please run "yarn run build-storybook" before running tests.'
    );
    return null;
  }
  return `file://${pathToStorybookStatic}`;
}
