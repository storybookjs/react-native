import React from 'react';
import { View, StyleSheet } from 'react-native';
// import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

export const decorators = [
  (StoryFn) => (
    <View style={styles.container}>
      <StoryFn />
    </View>
  ),
];
export const parameters = { my_param: 'anything' };

const styles = StyleSheet.create({
  container: { padding: 8 },
});
