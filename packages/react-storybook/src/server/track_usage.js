// ### WHAT?
//
// We will track anonymous usage of how you use storybook.
// We don't want any personal information.
// We just need to collect following information
//
//  * How many time a user runs start-storybook a day
//
// We will send a ping to our server when you run storybook with above information.

// ### WHY?
//
// We are maintaining React Storybook and we want to improve it.
// We also working on storybooks.io which is storybook related service.
// In order to get a real picture about the storybook usage,
// we need to get some real usage stats, not the amount of NPM downloads.
// This is why we do this.

// ### CAN I STOP THIS?
//
// You(or your company) may have certain policies.
// If so, you can stop sending these metrics.
// To do that, use --dont-track flag when running React Storybook.
//    start-storybook --dont-track -p 9001

// ### HELP US?
//
// Maintaining a open source project is hard.
// It's even harder for a startup like us (Kadira)
// Help us to make storybook better by sending these few metrics.
// Based on these metrics, we could improve storybook and build a profitable
// service around it. With that, we could continue to maintain and
// improve Storybook.

import ConfigStore from 'configstore';
import UUID from 'uuid';
import request from 'request';

const logger = console;

let DONT_TRACK = false;

export function getStore() {
  const key = 'react-storybook-usage';
  const store = new ConfigStore(key);
  return store;
}

export function track() {
  if (DONT_TRACK) return;

  const store = getStore();

  // Just a hash to aggregate metrics. Don't use any personal info.
  let userId = store.get('userId');
  if (!userId) {
    userId = UUID.v4();
    store.set('userId', userId);
  }

  const pkg = require('../../package.json');

  // We don't wanna worry about the success or failure of this.
  request.post(
    'https://ping.getstorybook.io/react-storybook-usage',
    {
      json: {
        userId,
        version: pkg.version,
      },
    },
    () => {},
  );

  if (!store.get('startTrackingOn')) {
    store.set('startTrackingOn', Date.now());
  }

  const pingsSent = store.get('pingsSent') || 0;
  store.set('pingsSent', pingsSent + 1);

  if (pingsSent < 5) {
    logger.log(' We will collect some anonymous usage stats of how you use storybook.');
    logger.log(' See why?: https://getstorybook.io/tracking');
    logger.log();
  }
}

export function dontTrack() {
  DONT_TRACK = true;
}
