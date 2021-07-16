import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Events from '@storybook/core-events';
import { AddonStore } from '@storybook/addons';
import { API } from '@storybook/api';
import { StoryStore } from '@storybook/client-api';

import Swatch from './Swatch';
import BackgroundEvents, { PARAM_KEY } from './constants';
import { Background } from './index';

const codeSample = `
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
type Selection = ReturnType<StoryStore['fromId']>;
interface BackgroundPanelProps {
  channel: Channel;
  api: API;
  active: boolean;
}

interface BackgroundPanelState {
  selection: Selection;
}

export default class BackgroundPanel extends Component<BackgroundPanelProps, BackgroundPanelState> {
  componentDidMount() {
    this.props.channel.on(Events.SELECT_STORY, this.onStorySelected);
  }

  componentWillUnmount() {
    this.props.channel.removeListener(Events.SELECT_STORY, this.onStorySelected);
  }

  setBackgroundFromSwatch = (background: string) => {
    this.props.channel.emit(BackgroundEvents.UPDATE_BACKGROUND, background);
  };

  onStorySelected = (selection: Selection) => {
    this.setState({ selection });
  };

  render() {
    const { active, api } = this.props;

    if (!active || !this.state) {
      return null;
    }

    const story = api.store().getRawStory(this.state.selection.kind, this.state.selection.name);
    const backgrounds: Background[] = story.parameters[PARAM_KEY];

    return (
      <View>
        {backgrounds ? (
          backgrounds.map(({ value, name }) => (
            <View key={`${name} ${value}`}>
              <Swatch value={value} name={name} setBackground={this.setBackgroundFromSwatch} />
            </View>
          ))
        ) : (
          <Instructions />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: { fontSize: 16 },
  paragraph: { marginBottom: 8 },
});
