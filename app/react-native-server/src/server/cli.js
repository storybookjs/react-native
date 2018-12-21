import path from 'path';
import program from 'commander';

export function parseList(str) {
  return str.split(',');
}

function getCli() {
  program
    .option('-h, --host <host>', 'host to listen on', 'localhost')
    .option('-p, --port <port>', 'port to listen on', 7007)
    .option('-e, --environment [environment]', 'DEVELOPMENT/PRODUCTION environment for webpack')
    .option('-i, --manual-id', 'allow multiple users to work with same storybook')
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

  const configDir = path.resolve(program.configDir || './storybook');

  return {
    ...program,
    configDir,
  };
}

export default getCli;
