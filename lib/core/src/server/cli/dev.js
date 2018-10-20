import program from 'commander';
import chalk from 'chalk';
import detectFreePort from 'detect-port';
import inquirer from 'inquirer';
import { logger } from '@storybook/node-logger';
import { parseList, getEnvConfig } from './utils';

const getFreePort = port =>
  detectFreePort(port).catch(error => {
    logger.error(error);
    process.exit(-1);
  });

async function getCLI(packageJson) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  program
    .version(packageJson.version)
    .option('-p, --port [number]', 'Port to run Storybook', str => parseInt(str, 10))
    .option('-h, --host [string]', 'Host to run Storybook')
    .option('-s, --static-dir <dir-names>', 'Directory where to load static files from', parseList)
    .option('-c, --config-dir [dir-name]', 'Directory where to load Storybook configurations from')
    .option(
      '--https',
      'Serve Storybook over HTTPS. Note: You must provide your own certificate information.'
    )
    .option(
      '--ssl-ca <ca>',
      'Provide an SSL certificate authority. (Optional with --https, required if using a self-signed certificate)',
      parseList
    )
    .option('--ssl-cert <cert>', 'Provide an SSL certificate. (Required with --https)')
    .option('--ssl-key <key>', 'Provide an SSL key. (Required with --https)')
    .option('--smoke-test', 'Exit after successful start')
    .option('--ci', "CI mode (skip interactive prompts, don't open browser")
    .option('--quiet', 'Suppress verbose build output')
    .parse(process.argv);

  logger.info(chalk.bold(`${packageJson.name} v${packageJson.version}`) + chalk.reset('\n'));

  // The key is the field created in `program` variable for
  // each command line argument. Value is the env variable.
  getEnvConfig(program, {
    port: 'SBCONFIG_PORT',
    host: 'SBCONFIG_HOSTNAME',
    staticDir: 'SBCONFIG_STATIC_DIR',
    configDir: 'SBCONFIG_CONFIG_DIR',
  });

  const port = await getFreePort(program.port);

  if (!program.ci && !program.smokeTest && program.port != null && port !== program.port) {
    const { shouldChangePort } = await inquirer.prompt({
      type: 'confirm',
      default: true,
      name: 'shouldChangePort',
      message: `Port ${program.port} is not available.
Would you like to run Storybook on port ${port} instead?`,
    });
    if (!shouldChangePort) {
      process.exit(1);
    }
  }

  return { ...program, port };
}

export default getCLI;
