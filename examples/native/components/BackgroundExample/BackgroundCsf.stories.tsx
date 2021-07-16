import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { Dimensions, Text, View, StyleSheet } from 'react-native';

const Background = () => (
  <View style={styles.view}>
    <Text style={styles.text}>Change background color via Addons -&gt; Background</Text>
  </View>
);

const styles = StyleSheet.create({
  view: { height: Dimensions.get('window').height },
  text: { color: 'black' },
});

const BackgroundMeta: ComponentMeta<typeof Background> = {
  title: 'Background CSF',
  component: Background,
  decorators: [withBackgrounds],
  parameters: {
    backgrounds: [
      { name: 'warm', value: 'hotpink', default: true },
      { name: 'cool', value: 'deepskyblue' },
    ],
  },
};

export default BackgroundMeta;

type BackgroundStory = ComponentStory<typeof Background>;

export const Basic: BackgroundStory = () => <Background />;
