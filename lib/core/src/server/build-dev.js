import express from 'express';
import https from 'https';
import ip from 'ip';
import favicon from 'serve-favicon';
import program from 'commander';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import detectFreePort from 'detect-port';
import inquirer from 'inquirer';
import { logger } from '@storybook/node-logger';
import fetch from 'node-fetch';
import Cache from 'file-system-cache';
import opn from 'opn';
import boxen from 'boxen';
import semver from 'semver';
import { stripIndents } from 'common-tags';
import Table from 'tty-table';

import storybook, { webpackValid } from './middleware';
import { parseList, getEnvConfig } from './utils';
import './config/env';

const defaultFavIcon = require.resolve('./public/favicon.ico');

const cache = Cache({
  ns: 'storybook', // Optional. A grouping namespace for items.
});

const getFreePort = port =>
  detectFreePort(port).catch(error => {
    logger.error(error);
    process.exit(-1);
  });

export async function buildDev({ packageJson, ...loadOptions }) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  program
    .version(packageJson.version)
    .option('-p, --port [number]', 'Port to run Storybook', str => parseInt(str, 10))
    .option('-h, --host [string]', 'Host to run Storybook')
    .option('-s, --static-dir <dir-names>', 'Directory where to load static files from')
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

  // Used with `app.listen` below
  const listenAddr = [port];

  if (program.host) {
    listenAddr.push(program.host);
  }

  const app = express();
  let server = app;

  if (program.https) {
    if (!program.sslCert) {
      logger.error('Error: --ssl-cert is required with --https');
      process.exit(-1);
    }
    if (!program.sslKey) {
      logger.error('Error: --ssl-key is required with --https');
      process.exit(-1);
    }

    const sslOptions = {
      ca: (program.sslCa || []).map(ca => fs.readFileSync(ca, 'utf-8')),
      cert: fs.readFileSync(program.sslCert, 'utf-8'),
      key: fs.readFileSync(program.sslKey, 'utf-8'),
    };

    server = https.createServer(sslOptions, app);
  }

  let hasCustomFavicon = false;

  if (program.staticDir) {
    program.staticDir = parseList(program.staticDir);
    program.staticDir.forEach(dir => {
      const staticPath = path.resolve(dir);
      if (!fs.existsSync(staticPath)) {
        logger.error(`Error: no such directory to load static files: ${staticPath}`);
        process.exit(-1);
      }
      logger.info(`=> Loading static files from: ${staticPath} .`);
      app.use(express.static(staticPath, { index: false }));

      const faviconPath = path.resolve(staticPath, 'favicon.ico');
      if (fs.existsSync(faviconPath)) {
        hasCustomFavicon = true;
        app.use(favicon(faviconPath));
      }
    });
  }

  if (!hasCustomFavicon) {
    app.use(favicon(defaultFavIcon));
  }

  // Build the webpack configuration using the `baseConfig`
  // custom `.babelrc` file and `webpack.config.js` files
  const configDir = program.configDir || './.storybook';

  // NOTE changes to env should be done before calling `getBaseConfig`
  // `getBaseConfig` function which is called inside the middleware
  app.use(storybook(configDir, loadOptions, program.quiet));

  let serverResolve = () => {};
  let serverReject = () => {};
  const serverListening = new Promise((resolve, reject) => {
    serverResolve = resolve;
    serverReject = reject;
  });

  const updateCheck = async () => {
    let result;
    const time = Date.now();
    try {
      const fromCache = await cache.get('lastUpdateCheck', { success: false, time: 0 });

      // if last check was more then 24h ago
      if (time - 86400000 > fromCache.time) {
        const fromFetch = await fetch('https://storybooks.netlify.com/versions.json');
        const data = await fromFetch.json();
        result = { success: true, data, time };
        await cache.set('lastUpdateCheck', result);
      } else {
        result = fromCache;
      }
    } catch (error) {
      result = { success: false, error, time };
    }
    return result;
  };

  server.listen(...listenAddr, error => {
    if (error) {
      serverReject(error);
    } else {
      serverResolve();
    }
  });

  try {
    const [stats, updateInfo] = await Promise.all([webpackValid, updateCheck(), serverListening]);
    const proto = program.https ? 'https' : 'http';
    const address = `${proto}://${program.host || 'localhost'}:${port}/`;
    const networkAddress = `${proto}://${ip.address()}:${port}/`;

    const updateMessage =
      updateInfo.success && semver.lt(packageJson.version, updateInfo.data.latest.version)
        ? stripIndents`
          ${chalk.hex('#F3AD38')(
            `A new version (${chalk.bold(updateInfo.data.latest.version)}) is available!`
          )}
          ${chalk.gray(updateInfo.data.latest.info.plain)}

          ${chalk.gray('Read full changelog here:')}
          ${chalk.gray.underline('https://git.io/fxc61')}
        `
        : '';

    const serveMessage = stripIndents(
      Table([['Local', chalk.cyan(address)], ['On your network', chalk.cyan(networkAddress)]], {
        borderStyle: 0,
        paddingLeft: 0,
        compact: true,
        paddingBottom: 0,
        align: 'left',
        color: 'white',
      }).render()
    );

    console.log(
      boxen(
        stripIndents`
          ${chalk.hex('#A2E05E')(`Storybook ${chalk.bold(packageJson.version)} started`)}

          ${serveMessage}${updateMessage ? `\n\n${updateMessage}` : ''}
        `,
        { borderStyle: 'round', padding: 1, borderColor: '#F1618C' }
      )
    );

    if (program.smokeTest) {
      process.exit(stats.toJson().warnings.length ? 1 : 0);
    } else if (!program.ci) {
      opn(address);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error);
    }
    if (program.smokeTest) {
      process.exit(1);
    }
  }
}
