import React from 'react';
import { View, StyleSheet, Appearance } from 'react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { Preview } from '@storybook/react';

const styles = StyleSheet.create({
  container: { padding: 8, flex: 1 },
});

export default {
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
    withBackgrounds,
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    my_param: 'anything',
    backgrounds: {
      default: Appearance.getColorScheme() === 'dark' ? 'dark' : 'plain',
      values: [
        { name: 'plain', value: 'white' },
        { name: 'dark', value: '#333' },
        { name: 'app', value: '#eeeeee' },
      ],
    },
  },
} satisfies Preview;
