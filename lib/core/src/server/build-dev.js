import express from 'express';
import https from 'https';
import http from 'http';
import ip from 'ip';
import favicon from 'serve-favicon';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { logger, colors, instance as npmLog } from '@storybook/node-logger';
import fetch from 'node-fetch';
import Cache from 'file-system-cache';
import findCacheDir from 'find-cache-dir';
import open from 'open';
import boxen from 'boxen';
import semver from 'semver';
import { stripIndents } from 'common-tags';
import Table from 'cli-table3';
import prettyTime from 'pretty-hrtime';
import inquirer from 'inquirer';
import detectFreePort from 'detect-port';

import storybook from './dev-server';
import { getDevCli } from './cli';

const defaultFavIcon = require.resolve('./public/favicon.ico');
const cacheDir = findCacheDir({ name: 'storybook' });
const cache = Cache({
  basePath: cacheDir,
  ns: 'storybook', // Optional. A grouping namespace for items.
});

const writeStats = async (name, stats) => {
  await fs.writeFile(
    path.join(cacheDir, `${name}-stats.json`),
    JSON.stringify(stats.toJson(), null, 2),
    'utf8'
  );
};

const getFreePort = port =>
  detectFreePort(port).catch(error => {
    logger.error(error);
    process.exit(-1);
  });

async function getServer(app, options) {
  if (!options.https) {
    return http.createServer(app);
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
    ca: await Promise.all((options.sslCa || []).map(ca => fs.readFile(ca, 'utf-8'))),
    cert: await fs.readFile(options.sslCert, 'utf-8'),
    key: await fs.readFile(options.sslKey, 'utf-8'),
  };

  return https.createServer(sslOptions, app);
}

async function applyStatic(app, options) {
  const { staticDir } = options;

  let hasCustomFavicon = false;

  if (staticDir && staticDir.length) {
    await Promise.all(
      staticDir.map(async dir => {
        const staticPath = path.resolve(dir);

        if (await !fs.exists(staticPath)) {
          logger.error(`Error: no such directory to load static files: ${staticPath}`);
          process.exit(-1);
        }

        logger.info(`=> Loading static files from: ${staticPath} .`);
        app.use(express.static(staticPath, { index: false }));

        const faviconPath = path.resolve(staticPath, 'favicon.ico');

        if (await fs.exists(faviconPath)) {
          hasCustomFavicon = true;
          app.use(favicon(faviconPath));
        }
      })
    );
  }

  if (!hasCustomFavicon) {
    app.use(favicon(defaultFavIcon));
  }
}

const updateCheck = async version => {
  let result;
  const time = Date.now();
  try {
    const fromCache = await cache.get('lastUpdateCheck', { success: false, time: 0 });

    // if last check was more then 24h ago
    if (time - 86400000 > fromCache.time) {
      const fromFetch = await Promise.race([
        fetch(`https://storybook.js.org/versions.json?current=${version}`),
        // if fetch is too slow, we won't wait for it
        new Promise((res, rej) => global.setTimeout(rej, 1500)),
      ]);
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

function createUpdateMessage(updateInfo, version) {
  let updateMessage;

  try {
    updateMessage =
      updateInfo.success && semver.lt(version, updateInfo.data.latest.version)
        ? stripIndents`
          ${colors.orange(
            `A new version (${chalk.bold(updateInfo.data.latest.version)}) is available!`
          )}

          ${chalk.gray('Read full changelog here:')} ${chalk.gray.underline('https://git.io/fhFYe')}
        `
        : '';
  } catch (e) {
    updateMessage = '';
  }
  return updateMessage;
}

function outputStartupInformation(options) {
  const {
    updateInfo,
    version,
    address,
    networkAddress,
    managerTotalTime,
    previewTotalTime,
  } = options;

  const updateMessage = createUpdateMessage(updateInfo, version);

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
    ['Local:', chalk.cyan(address)],
    ['On your network:', chalk.cyan(networkAddress)]
  );

  const timeStatement = previewTotalTime
    ? `${chalk.underline(prettyTime(managerTotalTime))} for manager and ${chalk.underline(
        prettyTime(previewTotalTime)
      )} for preview`
    : `${chalk.underline(prettyTime(managerTotalTime))}`;

  // eslint-disable-next-line no-console
  console.log(
    boxen(
      stripIndents`
          ${colors.green(`Storybook ${chalk.bold(version)} started`)}
          ${chalk.gray(timeStatement)}

          ${serveMessage.toString()}${updateMessage ? `\n\n${updateMessage}` : ''}
        `,
      { borderStyle: 'round', padding: 1, borderColor: '#F1618C' }
    )
  );
}

async function outputStats(previewStats, managerStats) {
  if (previewStats) {
    await writeStats('preview', previewStats);
  }
  await writeStats('manager', managerStats);
  logger.info(`stats written to => ${chalk.cyan(path.join(cacheDir, '[name].json'))}`);
}

function openInBrowser(address) {
  open(address).catch(() => {
    logger.error(stripIndents`
      Could not open ${address} inside a browser. If you're running this command inside a
      docker container or on a CI, you need to pass the '--ci' flag to prevent opening a
      browser by default.
    `);
  });
}

export async function buildDevStandalone(options) {
  try {
    const { host, extendServer } = options;

    const port = await getFreePort(options.port);

    if (!options.ci && !options.smokeTest && options.port != null && port !== options.port) {
      const { shouldChangePort } = await inquirer.prompt({
        type: 'confirm',
        default: true,
        name: 'shouldChangePort',
        message: `Port ${options.port} is not available. Would you like to run Storybook on port ${port} instead?`,
      });

      if (!shouldChangePort) {
        process.exit(1);
      }
    }

    // Used with `app.listen` below
    const listenAddr = [port];

    if (host) {
      listenAddr.push(host);
    }

    const app = express();
    const server = await getServer(app, options);

    if (typeof extendServer === 'function') {
      extendServer(server);
    }

    await applyStatic(app, options);

    const {
      router: storybookMiddleware,
      previewStats,
      managerStats,
      managerTotalTime,
      previewTotalTime,
    } = await storybook(options);

    app.use(storybookMiddleware);

    const serverListening = listenToServer(server, listenAddr);
    const { version } = options.packageJson;

    const [updateInfo] = await Promise.all([updateCheck(version), serverListening]);

    const proto = options.https ? 'https' : 'http';
    const address = `${proto}://${options.host || 'localhost'}:${port}/`;
    const networkAddress = `${proto}://${ip.address()}:${port}/`;

    if (options.smokeTest) {
      await outputStats(previewStats, managerStats);

      let warning = 0;

      if (!options.ignorePreview) {
        warning += previewStats.toJson().warnings.length;
      }

      warning += managerStats.toJson().warnings.length;

      process.exit(warning ? 1 : 0);
      return;
    }

    outputStartupInformation({
      updateInfo,
      version,
      address,
      networkAddress,
      managerTotalTime,
      previewTotalTime,
    });

    if (!options.ci) {
      openInBrowser(address);
    }
  } catch (error) {
    // this is a weird bugfix, somehow 'node-pre-gyp' is polluting the npmLog header
    npmLog.heading = '';

    logger.line();
    logger.warn(
      error.close
        ? stripIndents`
            FATAL broken build!, will close the process,
            Fix the error below and restart storybook.
          `
        : stripIndents`
            Broken build, fix the error below.
            You may need to refresh the browser.
          `
    );
    logger.line();
    if (error instanceof Error) {
      if (error.error) {
        logger.error(error.error);
      } else if (error.stats && error.stats.compilation.errors) {
        error.stats.compilation.errors.forEach(e => logger.plain(e));
      } else {
        logger.error(error);
      }

      if (error.close) {
        process.exit(1);
      }
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
    configDir: loadOptions.configDir || cliOptions.configDir || './.storybook',
    ignorePreview: !!cliOptions.previewUrl,
    docsMode: !!cliOptions.docs,
  });
}
