import express from 'express';
import https from 'https';
import ip from 'ip';
import favicon from 'serve-favicon';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { logger } from '@storybook/node-logger';
import opn from 'opn';
import { stripIndents } from 'common-tags';
import storybook, { webpackValid } from './middleware';
import { getDevCli } from './cli';
import './config/env';

const defaultFavIcon = require.resolve('./public/favicon.ico');

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
  const { port, host } = options;

  // Used with `app.listen` below
  const listenAddr = [port];

  if (host) {
    listenAddr.push(host);
  }

  const app = express();
  const server = getServer(app, options);

  applyStatic(app, options);

  app.use(storybook(options));

  const serverListening = listenToServer(server, listenAddr);

  try {
    const [stats] = await Promise.all([webpackValid, serverListening]);
    const proto = options.https ? 'https' : 'http';
    const address = `${proto}://${host || 'localhost'}:${port}/`;
    const networkAddress = `${proto}://${ip.address()}:${port}/`;
    logger.info(`Storybook started on => ${chalk.cyan(address)}`);
    logger.info(`Available on the network at => ${chalk.cyan(networkAddress)}\n`);

    if (options.smokeTest) {
      process.exit(stats.toJson().warnings.length ? 1 : 0);
    } else if (!options.ci) {
      opn(address).catch(() => {
        logger.error(stripIndents`Could not open ${address} inside a browser. If you're running this command inside a
docker container or on a CI, you need to pass the '--ci' flag to prevent opening a
browser by default.`);
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
    configDir: cliOptions.configDir || './.storybook',
  });
}
