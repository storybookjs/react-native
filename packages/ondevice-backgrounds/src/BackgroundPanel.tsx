import { StyleSheet, Text, View } from 'react-native';
import type { AddonStore, API } from 'storybook/internal/manager-api';

import { useGlobals } from 'storybook/internal/preview-api';
import Swatch from './Swatch';
import { PARAM_KEY } from './constants';

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
     backgrounds: {
      options: {
        // 👇 Default options
        dark: { name: 'Dark', value: '#333' },
        light: { name: 'Light', value: '#F7F9F2' },
        // 👇 Add your own
        maroon: { name: 'Maroon', value: '#400' },
      },
    },
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
  api: API;
  active: boolean;
}

interface BackgroundOptions {
  [key: string]: {
    name: string;
    value: string;
  };
}

const BackgroundPanel = ({ active, api }: BackgroundPanelProps) => {
  const [, updateGlobals] = useGlobals();
  const store = api.store();
  const storyId = store.getSelection().storyId;
  const story = store.fromId(storyId);

  if (!active) {
    return null;
  }

  const backgrounds: BackgroundOptions = story.parameters[PARAM_KEY]?.options;
  const setBackgroundFromSwatch = (background: string) => {
    updateGlobals({
      [PARAM_KEY]: { value: background },
    });
  };

  return (
    <View style={{ padding: 10 }}>
      {backgrounds ? (
        Object.entries(backgrounds).map(([name, { value }]) => (
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
