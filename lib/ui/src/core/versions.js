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
  const { versions: persistedVersions = {} } = store.getState();
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
    const { versions = {}, lastVersionCheck } = store.getState();

    const now = Date.now();
    if (!lastVersionCheck || now - lastVersionCheck > checkInterval) {
      try {
        const { latest } = await fetchLatestVersion(currentVersion);
        versions[latest.version] = {
          ...latest,
          tag: 'latest',
          current: currentVersion === latest.version,
        };
        store.setState({ versions, lastVersionCheck: now }, { persistence: 'permanent' });
      } catch (error) {
        logger.warn(`Failed to fetch latest version from server: ${error}`);
      }
    }

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
