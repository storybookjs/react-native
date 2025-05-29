import type { ExpoConfig } from 'expo/config';

export default {
  name: 'Expo Example',
  slug: 'expo-example',
  web: {
    bundler: 'metro',
  },
  experiments: {
    reactCompiler: false,
  },
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
} satisfies ExpoConfig;
