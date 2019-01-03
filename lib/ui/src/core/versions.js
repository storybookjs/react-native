export default function({ store }) {
  // Should we make this an api? Does it make sense to call it anywhere except the init function below?
  function addVersion({ version, tag }) {
    const { versions = {}, currentVersion } = store.getState();
    versions[version] = { version, tag, current: currentVersion === version };
    store.setState({ versions });
  }

  // This function when implemented will probably be in an external file
  async function getVersions() {
    // We would get this from the server
    return [
      {
        version: '4.0.0',
        tag: 'latest',
      },
      {
        version: '3.0.0',
      },
    ];
  }

  const state = {
    // TODO: get this from package.json?
    currentVersion: '3.0.0',
  };

  const api = {
    getCurrentVersion: () => {
      const { currentVersion, versions } = store.getState();
      return versions[currentVersion];
    },
    getLatestVersion: () => {
      const { versions } = store.getState();
      return Object.values(versions).find(v => v.tag === 'latest');
    },
    versionUpdateAvailable: () => {
      const latestVersion = api.getLatestVersion();
      return latestVersion.version !== store.getState().currentVersion;
    },
  };

  // Grab versions from the server/local storage right away
  // FIXME: actually do this
  async function init({ api: { versionUpdateAvailable, getLatestVersion, addNotification } }) {
    const versions = await getVersions();
    versions.forEach(v => addVersion(v));

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
