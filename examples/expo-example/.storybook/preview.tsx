import React from 'react';
import { View, StyleSheet, Appearance } from 'react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { addDecorator } from '@storybook/react-native';

type Decorator = Parameters<typeof addDecorator>[0];

export const decorators: Decorator[] = [
  (Story) => (
    <View style={styles.container}>
      <Story />
    </View>
  ),
  withBackgrounds,
];

export const parameters = {
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
};

const styles = StyleSheet.create({
  container: { padding: 8, flex: 1 },
});
