import express from 'express';
import https from 'https';
import ip from 'ip';
import favicon from 'serve-favicon';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { logger } from '@storybook/node-logger';
import fetch from 'node-fetch';
import Cache from 'file-system-cache';
import opn from 'opn';
import boxen from 'boxen';
import semver from 'semver';
import { stripIndents } from 'common-tags';
import Table from 'cli-table3';

import storybook, { webpackValid } from './middleware';
import { getDevCli } from './cli';

const defaultFavIcon = require.resolve('./public/favicon.ico');

const cache = Cache({
  ns: 'storybook', // Optional. A grouping namespace for items.
});

function getServer(app, options) {
  if (!options.https) {
    return app;
  }

  if (!options.sslCert) {
    logger.error('Error: --ssl-cert is required with --https');
    process.exit(-1);
  }

  if (!options.sslKey) {
    logger.error('Error: --ssl-key is required with --https');
    process.exit(-1);
  }

  const sslOptions = {
    ca: (options.sslCa || []).map(ca => fs.readFileSync(ca, 'utf-8')),
    cert: fs.readFileSync(options.sslCert, 'utf-8'),
    key: fs.readFileSync(options.sslKey, 'utf-8'),
  };

  return https.createServer(sslOptions, app);
}

function applyStatic(app, options) {
  const { staticDir } = options;
  let hasCustomFavicon = false;

  if (staticDir) {
    staticDir.forEach(dir => {
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
}

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

function listenToServer(server, listenAddr) {
  let serverResolve = () => {};
  let serverReject = () => {};

  const serverListening = new Promise((resolve, reject) => {
    serverResolve = resolve;
    serverReject = reject;
  });

  server.listen(...listenAddr, error => {
    if (error) {
      serverReject(error);
    } else {
      serverResolve();
    }
  });

  return serverListening;
}

export async function buildDevStandalone(options) {
  try {
    const { port, host } = options;

    // Used with `app.listen` below
    const listenAddr = [port];

    if (host) {
      listenAddr.push(host);
    }

    const app = express();
    const server = getServer(app, options);

    applyStatic(app, options);

    const storybookMiddleware = await storybook(options);

    app.use(storybookMiddleware);

    const serverListening = listenToServer(server, listenAddr);

    const [stats, updateInfo] = await Promise.all([webpackValid, updateCheck(), serverListening]);
    const proto = options.https ? 'https' : 'http';
    const address = `${proto}://${options.host || 'localhost'}:${port}/`;
    const networkAddress = `${proto}://${ip.address()}:${port}/`;

    let updateMessage;

    try {
      updateMessage =
        updateInfo.success && semver.lt(options.packageJson.version, updateInfo.data.latest.version)
          ? stripIndents`
          ${chalk.hex('#F3AD38')(
            `A new version (${chalk.bold(updateInfo.data.latest.version)}) is available!`
          )}
          ${chalk.gray(updateInfo.data.latest.info.plain)}

          ${chalk.gray('Read full changelog here:')}
          ${chalk.gray.underline('https://git.io/fxc61')}
        `
          : '';
    } catch (e) {
      updateMessage = '';
    }

    const serveMessage = new Table({
      chars: {
        top: '',
        'top-mid': '',
        'top-left': '',
        'top-right': '',
        bottom: '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        left: '',
        'left-mid': '',
        mid: '',
        'mid-mid': '',
        right: '',
        'right-mid': '',
        middle: '',
      },
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    });

    serveMessage.push(
      ['Local', chalk.cyan(address)],
      ['On your network', chalk.cyan(networkAddress)]
    );

    // eslint-disable-next-line no-console
    console.log(
      boxen(
        stripIndents`
          ${chalk.hex('#A2E05E')(`Storybook ${chalk.bold(options.packageJson.version)} started`)}

          ${serveMessage.toString()}${updateMessage ? `\n\n${updateMessage}` : ''}
        `,
        { borderStyle: 'round', padding: 1, borderColor: '#F1618C' }
      )
    );

    if (options.smokeTest) {
      process.exit(stats.toJson().warnings.length ? 1 : 0);
    } else if (!options.ci) {
      opn(address).catch(() => {
        logger.error(stripIndents`
          Could not open ${address} inside a browser. If you're running this command inside a
          docker container or on a CI, you need to pass the '--ci' flag to prevent opening a
          browser by default.
        `);
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error);
    }
    if (options.smokeTest) {
      process.exit(1);
    }
  }
}

export async function buildDev({ packageJson, ...loadOptions }) {
  const cliOptions = await getDevCli(packageJson);

  await buildDevStandalone({
    ...cliOptions,
    ...loadOptions,
    packageJson,
    configDir: cliOptions.configDir || './.storybook',
  });
}
