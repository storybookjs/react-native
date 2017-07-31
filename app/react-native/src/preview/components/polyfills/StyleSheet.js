import { StyleSheet } from 'react-native';

/**
 * Certain features of StyleSheet are only available in later ReactNative version.
 *
 * This module polyfills:
 * - absoluteFillObject
 */
export default {
  ...StyleSheet,
  absoluteFillObject: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};
