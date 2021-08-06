import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AddonStore } from '@storybook/addons';
import { API } from '@storybook/api';

import Swatch from './Swatch';
import BackgroundEvents, { PARAM_KEY } from './constants';
import { Background } from './index';

const codeSample = `
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { Text, StyleSheet } from 'react-native';

const Background = () => (
  <Text style={styles.text}>Change background color via Addons -&gt; Background</Text>
);

const styles = StyleSheet.create({
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
`.trim();

const Instructions = () => (
  <View>
    <Text style={[styles.paragraph, styles.title]}>Setup Instructions</Text>
    <Text style={styles.paragraph}>
      Please add the background decorator definition to your story. The background decorate accepts
      an array of items, which should include a name for your color (preferably the css class name)
      and the corresponding color / image value.
    </Text>
    <Text style={styles.paragraph}>
      Below is an example of how to add the background decorator to your story definition. Long
      press the example to copy it.
    </Text>
    <Text selectable>{codeSample}</Text>
  </View>
);

export type Channel = ReturnType<AddonStore['getChannel']>;
interface BackgroundPanelProps {
  channel: Channel;
  api: API;
  active: boolean;
}

const BackgroundPanel = ({ active, api, channel }: BackgroundPanelProps) => {
  if (!active) {
    return null;
  }

  const store = api.store();
  const storyId = store.getSelection().storyId;
  const story = store.fromId(storyId);
  const backgrounds: Background[] = story.parameters[PARAM_KEY];
  const setBackgroundFromSwatch = (background: string) => {
    channel.emit(BackgroundEvents.UPDATE_BACKGROUND, background);
  };
  return (
    <View>
      {backgrounds ? (
        backgrounds.map(({ value, name }) => (
          <View key={`${name} ${value}`}>
            <Swatch value={value} name={name} setBackground={setBackgroundFromSwatch} />
          </View>
        ))
      ) : (
        <Instructions />
      )}
    </View>
  );
};

export default BackgroundPanel;

const styles = StyleSheet.create({
  title: { fontSize: 16 },
  paragraph: { marginBottom: 8 },
});
