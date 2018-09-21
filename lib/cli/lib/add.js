import path from 'path';
import fs from 'fs';
import { sync as spawnSync } from 'cross-spawn';
import hasYarn from './has_yarn';
import latestVersion from './latest_version';
import { commandLog } from './helpers';

const logger = console;
export const storybookAddonScope = '@storybook/addon-';

const isAddon = async (name, npmOptions) => {
  try {
    await latestVersion(npmOptions, name);
    return true;
  } catch (e) {
    return false;
  }
};

const isStorybookAddon = async (name, npmOptions) =>
  isAddon(`${storybookAddonScope}${name}`, npmOptions);

const installAddon = (addonName, npmOptions, isAStorybookAddon) => {
  const prepareDone = commandLog(`Preparing to install the ${addonName} Storybook addon`);
  prepareDone();
  logger.log();

  let result;
  const packageName = isAStorybookAddon ? `${storybookAddonScope}${addonName}` : addonName;
  if (npmOptions.useYarn) {
    result = spawnSync('yarn', ['add', packageName, '--dev'], {
      stdio: 'inherit',
    });
  } else {
    result = spawnSync('npm', ['install', packageName, '--save-dev'], {
      stdio: 'inherit',
    });
  }

  logger.log();
  const installDone = commandLog(`Installing the ${addonName} Storybook addon`);
  if (result.status !== 0) {
    installDone(`Something went wrong installing the addon: "${packageName}"`);
    logger.log();
    process.exit(1);
  }
  installDone();
};

export const addStorybookAddonToFile = (addonName, addonsFile) => {
  const addonNameNoTag = addonName.split('@')[0];
  const alreadyRegistered = addonsFile.find(line => line.includes(`${addonNameNoTag}/register`));

  if (alreadyRegistered) {
    return addonsFile;
  }

  const latestImportIndex = addonsFile.reduce(
    (prev, curr, currIndex) =>
      curr.startsWith('import') && curr.includes('register') ? currIndex : prev,
    -1
  );

  return [
    ...addonsFile.slice(0, latestImportIndex + 1),
    `import '${storybookAddonScope}${addonNameNoTag}/register';`,
    ...addonsFile.slice(latestImportIndex + 1),
  ];
};

const registerAddon = addonName => {
  const registerDone = commandLog(`Registering the ${addonName} Storybook addon`);
  const addonsFilePath = path.resolve('.storybook/addons.js');
  const addonsFile = fs
    .readFileSync(addonsFilePath)
    .toString()
    .split('\n');
  fs.writeFileSync(addonsFilePath, addStorybookAddonToFile(addonName, addonsFile).join('\n'));
  registerDone();
};

export default async function add(addonName, options) {
  const useYarn = Boolean(options.useNpm !== true) && hasYarn();
  const npmOptions = {
    useYarn,
  };
  const addonCheckDone = commandLog(`Verifying that ${addonName} is an addon`);
  const isAStorybookAddon = await isStorybookAddon(addonName, npmOptions);
  if (isAStorybookAddon) {
    addonCheckDone();
    installAddon(addonName, npmOptions, isAStorybookAddon);
    registerAddon(addonName);
  } else {
    addonCheckDone(`The provided package was not a Storybook addon: ${addonName}.`);
  }
}
