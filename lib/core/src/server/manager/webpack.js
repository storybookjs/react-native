import console from 'console';

import webpack from 'webpack';
import { managerOptions as loadConfig } from '../config';

const { Console } = console;

const configDir = process.argv.reduce(
  (acc, i) => (i.includes('dir=') ? i.replace('dir=', '') : acc),
  './.storybook'
);
const configType = process.argv.reduce(
  (acc, i) => (i.includes('type=') ? i.replace('type=', '') : acc),
  'DEVELOPMENT'
);

const bad = new Console(process.stderr);
const good = new Console(process.stdout);

loadConfig({
  configType,
  configDir,
  corePresets: [require.resolve('../core-preset-manager.js')],
})
  .then(config => webpack(config))
  .then(
    compiler =>
      new Promise((res, rej) => {
        try {
          compiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
              bad.log(JSON.stringify({ err, data: stats.toJson() }, null, 2));
              rej(err);
            } else {
              res(`success! ${process.env.NODE_ENV}`);
            }
          });
        } catch (e) {
          rej(e);
        }
      })
  )
  .then(data => good.log(data))
  .catch(err => {
    bad.log(err);
    process.exit(1);
  });
