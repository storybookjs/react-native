import { logger } from '@storybook/client-logger';
import fetchLatestVersion from '../libs/fetch_latest_version';

export default function({ store }) {
  // Should we make this an api? Does it make sense to call it anywhere except the init function below?
  function addVersion({ version, tag }) {
    const { versions = {}, currentVersion } = store.getState();
    versions[version] = { version, tag, current: currentVersion === version };
    store.setState({ versions });
  }

  // TODO: get this from package.json?
  const currentVersion = '3.0.0';
  const state = {
    currentVersion,
    versions: {
      [currentVersion]: {
        version: currentVersion,
        current: true,
      },
    },
  };

  const api = {
    getCurrentVersion: () => {
      const { versions } = store.getState();
      return versions[currentVersion];
    },
    getLatestVersion: () => {
      const { versions } = store.getState();
      return Object.values(versions).find(v => v.tag === 'latest');
    },
    versionUpdateAvailable: () => {
      const latestVersion = api.getLatestVersion();
      return latestVersion && latestVersion.version !== store.getState().currentVersion;
    },
  };

  // Grab versions from the server/local storage right away
  async function init({ api: { versionUpdateAvailable, getLatestVersion, addNotification } }) {
    const { error, data } = await fetchLatestVersion(currentVersion);

    if (error) {
      logger.warn(`Failed to fetch latest version from server: ${error}`);
      return;
    }

    addVersion({
      tag: 'latest',
      ...data.latest,
    });

    if (versionUpdateAvailable()) {
      addNotification({
        id: 'update',
        level: 2,
        link: '/settings/about',
        icon: '🎉',
        content: `There's a new version available: ${getLatestVersion().version}`,
      });
    }
  }

  return { init, state, api };
}
