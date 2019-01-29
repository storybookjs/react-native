import { fetch } from 'global';
import { logger } from '@storybook/client-logger';

import currentVersion from '../version';

import { Module, API } from '../index';

const checkInterval = 24 * 60 * 60 * 1000;
const versionsUrl = 'https://storybook.js.org/versions.json';

async function fetchLatestVersion(v: string) {
  const fromFetch = await fetch(`${versionsUrl}?current=${v}`);
  return fromFetch.json();
}

export default function({ store }: Module) {
  const { versions: persistedVersions, lastVersionCheck, dismissedVersionNotification } = store.getState();

  // Check to see if we have info about the current version persisted
  const persistedCurrentVersion = Object.values(persistedVersions).find(v => v.version === currentVersion);
  const state = {
    versions: {
      ...persistedVersions,
      current: {
        version: currentVersion,
        ...(persistedCurrentVersion && { info: persistedCurrentVersion.info }),
      },
    },
    lastVersionCheck,
    dismissedVersionNotification,
  };

  const api = {
    getCurrentVersion: () => {
      const {
        versions: { current },
      } = store.getState();
      return current;
    },
    getLatestVersion: () => {
      const {
        versions: { latest },
      } = store.getState();
      return latest;
    },
    versionUpdateAvailable: () => {
      const latestVersion = api.getLatestVersion();
      return latestVersion && latestVersion.version !== store.getState().currentVersion;
    },
  };

  // Grab versions from the server/local storage right away
  async function init({ api: fullApi }: API) {
    const { versions = {} } = store.getState();

    const now = Date.now();
    if (!lastVersionCheck || now - lastVersionCheck > checkInterval) {
      try {
        const { latest } = await fetchLatestVersion(currentVersion);

        await store.setState({ versions: { ...versions, latest }, lastVersionCheck: now }, { persistence: 'permanent' });
      } catch (error) {
        logger.warn(`Failed to fetch latest version from server: ${error}`);
      }
    }

    if (fullApi.versionUpdateAvailable()) {
      const latestVersion = fullApi.getLatestVersion().version;

      if (latestVersion !== dismissedVersionNotification) {
        fullApi.addNotification({
          id: 'update',
          level: 2,
          link: '/settings/about',
          icon: '🎉',
          content: `There's a new version available: ${latestVersion}`,
          onClear() {
            store.setState({ dismissedVersionNotification: latestVersion }, { persistence: 'permanent' });
          },
        });
      }
    }
  }

  return { init, state, api };
}
