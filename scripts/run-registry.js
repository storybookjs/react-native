#!/usr/bin/env node -r esm
import { spawn, exec } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import detectFreePort from 'detect-port';
import { stripIndents } from 'common-tags';

import nodeCleanup from 'node-cleanup';

const logger = console;

const freePort = port => detectFreePort(port);

let verdaccioProcess;

const startVerdaccio = port => {
  let resolved = false;
  return new Promise((res, rej) => {
    verdaccioProcess = spawn('npx', [
      'verdaccio@4.0.0-beta.1',
      '-c',
      'scripts/verdaccio.yaml',
      '-l',
      port,
    ]);
    verdaccioProcess.stdout.on('data', data => {
      if (!resolved && data && data.toString().match(/http address/)) {
        const [url] = data.toString().match(/(http:.*\d\/)/);
        res(url);
        resolved = true;
      }
    });

    setTimeout(() => {
      rej(new Error(`TIMEOUT - verdaccio didn't start within 60s`));
      resolved = true;
      verdaccioProcess.kill();
    }, 60000);
  });
};
const registryUrl = (command, url) =>
  new Promise((res, rej) => {
    const args = url ? ['config', 'set', 'registry', url] : ['config', 'get', 'registry'];
    exec(`${command} ${args.join(' ')}`, (e, stdout) => {
      if (e) {
        rej(e);
      } else {
        res(url || stdout.toString().trim());
      }
    });
  });

const registriesUrl = (yarnUrl, npmUrl) =>
  Promise.all([registryUrl('yarn', yarnUrl), registryUrl('npm', npmUrl || yarnUrl)]);

nodeCleanup(() => {
  try {
    verdaccioProcess.kill();
  } catch (e) {
    //
  }
});

const applyRegistriesUrl = (yarnUrl, npmUrl, originalYarnUrl, originalNpmUrl) => {
  logger.log(`↪️  changing system config`);
  nodeCleanup(() => {
    registriesUrl(originalYarnUrl, originalNpmUrl);

    logger.log(stripIndents`
      Your registry config has been restored from:
      npm: ${npmUrl} to ${originalNpmUrl} 
      yarn: ${yarnUrl} to ${originalYarnUrl} 
    `);
  });

  return registriesUrl(yarnUrl, npmUrl);
};

const addUser = url =>
  new Promise((res, rej) => {
    logger.log(`👤 add temp user to verdaccio`);

    exec(`npx npm-cli-adduser -r "${url}" -a -u user -p password -e user@example.com`, e => {
      if (e) {
        rej(e);
      } else {
        res();
      }
    });
  });

const currentVersion = async () => {
  const { version } = (await import('../lerna.json')).default;
  return version;
};

const publish = (packages, url) =>
  packages.reduce((acc, { name, location }) => {
    return acc.then(() => {
      return new Promise((res, rej) => {
        logger.log(`🛫 publishing ${name} (${location})`);
        const command = `cd ${location} && npm publish --registry ${url} --force --access restricted`;
        exec(command, e => {
          if (e) {
            rej(e);
          } else {
            logger.log(`🛬 successful publish of ${name}!`);
            res();
          }
        });
      });
    });
  }, Promise.resolve());

const listOfPackages = () =>
  new Promise((res, rej) => {
    const command = `./node_modules/.bin/lerna list --json`;
    exec(command, (e, result) => {
      if (e) {
        rej(e);
      } else {
        const data = JSON.parse(result.toString().trim());
        res(data);
      }
    });
  });

const askForPermission = () =>
  inquirer
    .prompt([
      {
        type: 'confirm',
        message: `${chalk.red('BE WARNED')} do you want to change your ${chalk.underline(
          'system'
        )} default registry to the temp verdacio registry?`,
        name: 'sure',
      },
    ])
    .then(({ sure }) => sure);

const askForReset = () =>
  inquirer
    .prompt([
      {
        type: 'confirm',
        message: `${chalk.red(
          'THIS IS BAD'
        )} looks like something bad hapened, OR you're already using a local registry, shall we reset to the default registry https://registry.npmjs.org/ ?`,
        name: 'sure',
      },
    ])
    .then(({ sure }) => {
      if (sure) {
        logger.log(`↩️ changing system config`);
        return registriesUrl('https://registry.npmjs.org/');
      }
      return process.exit(1);
    });

const askForPublish = (packages, url, version) =>
  inquirer
    .prompt([
      {
        type: 'confirm',
        message: `${chalk.green('READY TO PUBLISH')} shall we kick off a publish?`,
        name: 'sure',
      },
    ])
    .then(({ sure }) => {
      if (sure) {
        logger.log(`🚀 publishing version ${version}`);
        return publish(packages, url).then(() => askForPublish(packages, url, version));
      }
      return false;
    });

const askForSubset = packages =>
  inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'which packages?',
        name: 'subset',
        pageSize: packages.length,
        choices: packages.map(p => ({ name: p.name, checked: true })),
      },
    ])
    .then(({ subset }) => packages.filter(p => subset.includes(p.name)));

const run = async () => {
  const port = await freePort(4873);
  logger.log(`🌏 found a open port: ${port}`);

  logger.log(`🔖 reading current registry settings`);
  let [originalYarnRegistryUrl, originalNpmRegistryUrl] = await registriesUrl();
  if (
    originalYarnRegistryUrl.includes('localhost') ||
    originalNpmRegistryUrl.includes('localhost')
  ) {
    await askForReset();
    originalYarnRegistryUrl = 'https://registry.npmjs.org/';
    originalNpmRegistryUrl = 'https://registry.npmjs.org/';
  }

  logger.log(`📐 reading version of storybook`);
  logger.log(`🚛 listing storybook packages`);
  logger.log(`🎬 starting verdaccio (this takes ±20 seconds, so be patient)`);

  const [shouldOverwrite, verdaccioUrl, packages, version] = await Promise.all([
    askForPermission(),
    startVerdaccio(port),
    listOfPackages(),
    currentVersion(),
  ]);

  logger.log(`🌿 verdaccio running on ${verdaccioUrl}`);

  if (shouldOverwrite) {
    logger.log(stripIndents`
      You have chosen to change your system's default registry url. If this process fails for some reason and doesn't exit correctly, you may be stuck with a npm/yarn config that's broken.
      To fix this you can revert back to the registry urls you had before by running:

      > npm config set registry ${originalNpmRegistryUrl}
      > yarn config set registry ${originalYarnRegistryUrl}

      You can now use regular install procedure anywhere on your machine and the storybook packages will be installed from this local registry

      The registry url is: ${verdaccioUrl}
    `);
  } else {
    logger.log(stripIndents`
      You have chosen to NOT change your system's default registry url. 

      The registry is running locally, but you'll need to add a npm/yarn config file in your project in that points to the registry.
      Here's a documentation for npm: https://docs.npmjs.com/files/npmrc
      Yarn is able to read this file as well

      The registry url is: ${verdaccioUrl}
    `);
  }

  if (shouldOverwrite) {
    await applyRegistriesUrl(
      verdaccioUrl,
      verdaccioUrl,
      originalYarnRegistryUrl,
      originalNpmRegistryUrl
    );
  }

  await addUser(verdaccioUrl);

  logger.log(`📦 found ${packages.length} storybook packages at version ${chalk.blue(version)}`);

  const subset = await askForSubset(packages);

  await askForPublish(subset, verdaccioUrl, version);

  logger.log(stripIndents`
    The verdaccio registry will now be terminated (this can take ±15 seconds, please be patient)
  `);

  verdaccioProcess.kill();
};

run();
