import { fetch } from 'global';
import semver from 'semver';
import { logger } from '@storybook/client-logger';

import { version as currentVersion } from '../version';

import { Module, API } from '../index';

export interface SubState {
  versions: {
    [key: string]: {
      [key: string]: any;
    };
    latest?: {
      version: string;
      info: string;
      [key: string]: any;
    };
    next?: {
      version: string;
      info: string;
      [key: string]: any;
    };
    current?: {
      version: string;
      info: string;
      [key: string]: any;
    };
  };
  lastVersionCheck: number;
  dismissedVersionNotification: boolean;
}

const checkInterval = 24 * 60 * 60 * 1000;
const versionsUrl = 'https://storybook.js.org/versions.json';

async function fetchLatestVersion(v: string) {
  const fromFetch = await fetch(`${versionsUrl}?current=${v}`);
  return fromFetch.json();
}

export default function({ store }: Module) {
  const {
    versions: persistedVersions,
    lastVersionCheck,
    dismissedVersionNotification,
  } = store.getState();

  // Check to see if we have info about the current version persisted
  const persistedCurrentVersion = Object.values(persistedVersions).find(
    v => v.version === currentVersion
  );
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
        versions: { latest, next, current },
      } = store.getState();
      if (current && semver.prerelease(current.version) && next) {
        return latest && semver.gt(latest.version, next.version) ? latest : next;
      }
      return latest;
    },
    versionUpdateAvailable: () => {
      const latest = api.getLatestVersion();
      const current = api.getCurrentVersion();

      return latest && semver.gt(latest.version, current.version);
    },
  };

  // Grab versions from the server/local storage right away
  async function init({ api: fullApi }: API) {
    const { versions = {} } = store.getState();

    const now = Date.now();
    if (!lastVersionCheck || now - lastVersionCheck > checkInterval) {
      try {
        const { latest, next } = await fetchLatestVersion(currentVersion);

        await store.setState(
          { versions: { ...versions, latest, next }, lastVersionCheck: now },
          { persistence: 'permanent' }
        );
      } catch (error) {
        logger.warn(`Failed to fetch latest version from server: ${error}`);
      }
    }

    if (fullApi.versionUpdateAvailable()) {
      const latestVersion = fullApi.getLatestVersion().version;

      if (latestVersion !== dismissedVersionNotification) {
        fullApi.addNotification({
          id: 'update',
          link: '/settings/about',
          content: `🎉 Storybook ${latestVersion} is available!`,
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
