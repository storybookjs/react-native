import React from 'react';
import { Text, View } from 'react-native';
// import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

export const decorators = [
  (StoryFn) => (
    <View>
      <Text>test</Text>
      <StoryFn />
    </View>
  ),
];
export const parameters = { my_param: 'anything' };
