import webpack from 'webpack';
import program from 'commander';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import shelljs from 'shelljs';
import packageJson from '../../package.json';
import getBaseConfig from './config/webpack.config.prod';
import loadConfig from './config';
import { parseList, getEnvConfig } from './utils';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// avoid ESLint errors
const logger = console;

program
  .version(packageJson.version)
  .option('-s, --static-dir <dir-names>', 'Directory where to load static files from', parseList)
  .option('-o, --output-dir [dir-name]', 'Directory where to store built files')
  .option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from')
  .option('-d, --db-path [db-file]', 'DEPRECATED!')
  .option('--enable-db', 'DEPRECATED!')
  .parse(process.argv);

logger.info(chalk.bold(`${packageJson.name} v${packageJson.version}\n`));

if (program.enableDb || program.dbPath) {
  logger.error(
    [
      'Error: the experimental local database addon is no longer bundled with',
      'react-storybook. Please remove these flags (-d,--db-path,--enable-db)',
      'from the command or npm script and try again.',
    ].join(' ')
  );
  process.exit(1);
}

// The key is the field created in `program` variable for
// each command line argument. Value is the env variable.
getEnvConfig(program, {
  staticDir: 'SBCONFIG_STATIC_DIR',
  outputDir: 'SBCONFIG_OUTPUT_DIR',
  configDir: 'SBCONFIG_CONFIG_DIR',
});

const configDir = program.configDir || './.storybook';
const outputDir = program.outputDir || './storybook-static';

// create output directory if not exists
shelljs.mkdir('-p', path.resolve(outputDir));
// clear the static dir
shelljs.rm('-rf', path.resolve(outputDir, 'static'));
shelljs.cp(path.resolve(__dirname, 'public/favicon.ico'), outputDir);

// Build the webpack configuration using the `baseConfig`
// custom `.babelrc` file and `webpack.config.js` files
// NOTE changes to env should be done before calling `getBaseConfig`
const config = loadConfig('PRODUCTION', getBaseConfig(), configDir);
config.output.path = path.resolve(outputDir);

// copy all static files
if (program.staticDir) {
  program.staticDir.forEach(dir => {
    if (!fs.existsSync(dir)) {
      logger.error(`Error: no such directory to load static files: ${dir}`);
      process.exit(-1);
    }
    logger.log(`=> Copying static files from: ${dir}`);
    shelljs.cp('-r', `${dir}/*`, outputDir);
  });
}

// compile all resources with webpack and write them to the disk.
logger.log('Building storybook ...');
webpack(config).run((err, stats) => {
  if (err || stats.hasErrors()) {
    logger.error('Failed to build the storybook');
    // eslint-disable-next-line no-unused-expressions
    err && logger.error(err.message);
    // eslint-disable-next-line no-unused-expressions
    stats && stats.hasErrors() && stats.toJson().errors.forEach(e => logger.error(e));
    process.exit(1);
  }
});
