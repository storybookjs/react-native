import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styled from '@emotion/native';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';

interface Props {
  stories: any;
  url: string;
  onDevice?: boolean;
}

const HelpContainer = styled.View`
  flex: 1;
  padding-horizontal: 15;
  padding-vertical: 15;
  align-items: center;
  justify-content: center;
`;

export default class StoryView extends Component<Props> {
  componentDidMount() {
    const channel = addons.getChannel();
    channel.on(Events.STORY_RENDER, this.forceReRender);
    channel.on(Events.FORCE_RE_RENDER, this.forceReRender);
  }

  componentWillUnmount() {
    const channel = addons.getChannel();
    channel.removeListener(Events.STORY_RENDER, this.forceReRender);
    channel.removeListener(Events.FORCE_RE_RENDER, this.forceReRender);
  }

  forceReRender = () => {
    this.forceUpdate();
  };

  renderHelp = () => {
    const { url } = this.props;
    return (
      <HelpContainer>
        {url && url.length ? (
          <Text>
            Please open the Storybook UI ({url}) with a web browser and select a story for preview.
          </Text>
        ) : (
          <Text>
            Please open the Storybook UI with a web browser and select a story for preview.
          </Text>
        )}
      </HelpContainer>
    );
  };

  renderOnDeviceUIHelp = () => (
    <HelpContainer>
      <Text>Please open navigator and select a story to preview.</Text>
    </HelpContainer>
  );

  render() {
    const { onDevice, stories } = this.props;

    const selection = stories.getSelection();

    const { id, storyFn } = selection;

    if (storyFn) {
      return (
        <View key={id} style={{ flex: 1 }}>
          {storyFn()}
        </View>
      );
    }

    if (onDevice) {
      return this.renderOnDeviceUIHelp();
    }

    return this.renderHelp();
  }
}
