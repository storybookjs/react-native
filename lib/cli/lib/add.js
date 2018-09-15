import { sync as spawnSync } from 'cross-spawn';
import hasYarn from './has_yarn';
import latestVersion from './latest_version';
import { commandLog } from './helpers';

const storybookAddonScope = '@storybook/addon-';

const isStorybookAddon = async (name, npmOptions) => {
  try {
    await latestVersion(npmOptions, `${storybookAddonScope}${name}`);
    return true;
  } catch (e) {
    return false;
  }
};

const installAddon = (addonName, npmOptions) => {
  const installDone = commandLog(`Installing the ${addonName} Storybook addon with`);
  let result;
  if (npmOptions.useYarn) {
    result = spawnSync('yarn', ['add', `${storybookAddonScope}${addonName}`, '--dev']);
  } else {
    result = spawnSync('npm', ['install', `${storybookAddonScope}${addonName}`, '--save-dev']);
  }
  if (result.status !== 0) {
    installDone(`Something went wrong installing the addon: "${storybookAddonScope}${addonName}"`);
    process.exit(1);
  }
  installDone();
};

export default async function add(addonName, options) {
  const useYarn = Boolean(options.useNpm !== true) && hasYarn();
  const npmOptions = {
    useYarn,
  };
  const storybookCheckDone = commandLog(`Verifying that ${addonName} is a Storybook addon`);
  if (await isStorybookAddon(addonName, npmOptions)) {
    storybookCheckDone();
    installAddon(addonName, npmOptions);
  } else {
    storybookCheckDone(`The provided package was not a Storybook addon: ${addonName}.`);
  }
}
