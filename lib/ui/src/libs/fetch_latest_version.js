// TODO: figure out a way to share this code with the CLI (lib/core/src/server/build-dev.js)

import { localStorage, fetch } from 'global';

const versionsUrl = 'https://storybook.js.org/versions.json';
const checkInterval = 24 * 60 * 60 * 1000;

export default async function fetchLatestVersion(currentVersion) {
  let result;
  const time = Date.now();
  try {
    const fromCache = (await localStorage.getItem('lastUpdateCheck')) || {
      success: false,
      time: 0,
    };

    // if last check was more then 24h ago
    if (!fromCache || time - fromCache.time > checkInterval) {
      const fromFetch = await Promise.race([
        fetch(`${versionsUrl}?current=${currentVersion}`),
        // if fetch is too slow, we won't wait for it
        new Promise((res, rej) => setTimeout(rej, 1500)),
      ]);
      const data = await fromFetch.json();
      result = { success: true, data, time };
      await localStorage.setItem('lastUpdateCheck', result);
    } else {
      result = fromCache;
    }
  } catch (error) {
    result = { success: false, error, time };
  }
  return result;
}
