import { logger } from '@storybook/client-logger';
import { fetch } from 'global';

import { version as currentVersion } from '../../package.json';

const checkInterval = 24 * 60 * 60 * 1000;

const versionsUrl = 'https://storybook.js.org/versions.json';
async function fetchLatestVersion() {
  const fromFetch = await fetch(`${versionsUrl}?current=${currentVersion}`);
  return fromFetch.json();
}

export default function({ store }) {
  const {
    versions: persistedVersions = {},
    lastVersionCheck,
    dismissedVersionNotification,
  } = store.getState();
  const state = {
    currentVersion,
    versions: {
      // Any saved versions
      ...Object.values(persistedVersions).reduce(
        (acc, v) => ({ ...acc, [v.version]: { ...v, current: false } }),
        {}
      ),
      // And the current version
      [currentVersion]: {
        ...persistedVersions[currentVersion],
        version: currentVersion,
        current: true,
      },
    },
    lastVersionCheck,
    dismissedVersionNotification,
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
    const { versions = {} } = store.getState();

    const now = Date.now();
    if (!lastVersionCheck || now - lastVersionCheck > checkInterval) {
      try {
        const { latest } = await fetchLatestVersion(currentVersion);
        versions[latest.version] = {
          ...latest,
          tag: 'latest',
          current: currentVersion === latest.version,
        };
        await store.setState({ versions, lastVersionCheck: now }, { persistence: 'permanent' });
      } catch (error) {
        logger.warn(`Failed to fetch latest version from server: ${error}`);
      }
    }

    if (versionUpdateAvailable()) {
      const latestVersion = getLatestVersion().version;

      if (latestVersion !== dismissedVersionNotification) {
        addNotification({
          id: 'update',
          level: 2,
          link: '/settings/about',
          icon: '🎉',
          content: `There's a new version available: ${latestVersion}`,
          onClear() {
            store.setState(
              { dismissedVersionNotification: latestVersion },
              { persistence: 'permanent' }
            );
          },
        });
      }
    }
  }

  return { init, state, api };
}
