import type { ExpoConfig } from 'expo/config';

export default {
  name: 'Expo Example',
  slug: 'expo-example',
  web: {
    bundler: 'metro',
  },
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
} satisfies ExpoConfig;
