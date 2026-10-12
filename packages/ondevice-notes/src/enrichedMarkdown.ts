import { Platform, UIManager } from 'react-native';

export type EnrichedMarkdownModule = typeof import('react-native-enriched-markdown');

let resolved = false;
let cached: EnrichedMarkdownModule | null = null;

function loadModule(): EnrichedMarkdownModule | null {
  try {
    // Optional peer: bundlers treat a require inside try/catch as optional.
    return require('react-native-enriched-markdown');
  } catch {
    return null;
  }
}

function hasNativeRenderer(): boolean {
  if (Platform.OS === 'web') {
    return true;
  }

  try {
    return UIManager.hasViewManagerConfig?.('EnrichedMarkdownText') === true;
  } catch {
    return false;
  }
}

export function getEnrichedMarkdown(): EnrichedMarkdownModule | null {
  if (!resolved) {
    resolved = true;
    const mod = loadModule();
    const available = mod !== null && hasNativeRenderer();
    cached = available ? mod : null;

    if (__DEV__ && mod && !available) {
      console.warn(
        '[storybook/notes] react-native-enriched-markdown is installed but its native module is not ' +
          'available, falling back to the JavaScript renderer. Rebuild your app after installing it ' +
          '(npx expo prebuild / pod install). Not supported in Expo Go or on tvOS.'
      );
    }
  }

  return cached;
}
