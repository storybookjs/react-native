'use strict';

/*
 * It only for Debug Remotely mode for Android
 * When __DEV__ === false, we can't use window.require('NativeModules')
 */
function getByRemoteConfig(hostname) {
  var remoteModuleConfig =
    typeof window !== 'undefined' &&
    window.__fbBatchedBridgeConfig &&
    window.__fbBatchedBridgeConfig.remoteModuleConfig;
  if (
    !Array.isArray(remoteModuleConfig) ||
    (hostname !== 'localhost' && hostname !== '127.0.0.1')
  ) {
    return { hostname: hostname, passed: false };
  }

  var constants = (remoteModuleConfig.find(getConstants) || [])[1];
  if (constants) {
    var serverHost = constants.ServerHost || hostname;
    return { hostname: serverHost.split(':')[0], passed: true };
  }
  return { hostname: hostname, passed: false };
}

function getConstants(config) {
  return config && (config[0] === 'AndroidConstants' || config[0] === 'PlatformConstants');
}

function getByRNRequirePolyfill(hostname) {
  var NativeModules;
  var PlatformConstants;
  var AndroidConstants;
  if (
    typeof window === 'undefined' ||
    !window.__DEV__ ||
    typeof window.require !== 'function' ||
    // RN >= 0.56
    // TODO: Get NativeModules for RN >= 0.56
    window.require.name === 'metroRequire'
  ) {
    return hostname;
  }
  NativeModules = window.require('NativeModules');

  if (!NativeModules || (!NativeModules.PlatformConstants && !NativeModules.AndroidConstants)) {
    return hostname;
  }
  PlatformConstants = NativeModules.PlatformConstants;
  AndroidConstants = NativeModules.AndroidConstants;

  var serverHost =
    (PlatformConstants ? PlatformConstants.ServerHost : AndroidConstants.ServerHost) || hostname;
  return serverHost.split(':')[0];
}

/*
 * Get React Native server IP if hostname is `localhost`
 * On Android emulator, the IP of host is `10.0.2.2` (Genymotion: 10.0.3.2)
 */
export default function getHost(hostname) {
  // Check if it in React Native environment
  if (
    typeof __fbBatchedBridge !== 'object' ||
    (hostname !== 'localhost' && hostname !== '127.0.0.1')
  ) {
    return hostname;
  }
  var result = getByRemoteConfig(hostname);

  // Leave if get hostname by remote config successful
  if (result.passed) {
    return result.hostname;
  }

  // Otherwise, use RN's require polyfill
  return getByRNRequirePolyfill(hostname);
}
