import program from 'commander';
import chalk from 'chalk';
import { logger } from '@storybook/node-logger';
import { parseList, getEnvConfig } from './utils';

function getCLI(packageJson) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';

  program
    .version(packageJson.version)
    .option('-s, --static-dir <dir-names>', 'Directory where to load static files from', parseList)
    .option('-o, --output-dir [dir-name]', 'Directory where to store built files')
    .option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from')
    .option('-w, --watch', 'Enable watch mode')
    .option('--quiet', 'Suppress verbose build output')
    .option('--no-dll', 'Do not use dll reference')
    .parse(process.argv);

  logger.info(chalk.bold(`${packageJson.name} v${packageJson.version}\n`));

  // The key is the field created in `program` variable for
  // each command line argument. Value is the env variable.
  getEnvConfig(program, {
    staticDir: 'SBCONFIG_STATIC_DIR',
    outputDir: 'SBCONFIG_OUTPUT_DIR',
    configDir: 'SBCONFIG_CONFIG_DIR',
  });

  return { ...program };
}

export default getCLI;
