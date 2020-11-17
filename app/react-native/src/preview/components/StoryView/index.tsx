import styled from '@emotion/native';
import addons from '@storybook/addons';
import { StoryStore } from '@storybook/client-api';
import Events from '@storybook/core-events';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

interface Props {
  storyStore: StoryStore;
  url: string;
  onDevice?: boolean;
}

interface State {
  storyId: string;
}

const HelpContainer = styled.View`
  flex: 1;
  padding-horizontal: 15;
  padding-vertical: 15;
  align-items: center;
  justify-content: center;
`;

export default class StoryView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyId: props.storyStore.getSelection()?.storyId || '',
    };
  }

  componentDidMount() {
    const channel = addons.getChannel();
    channel.on(Events.CURRENT_STORY_WAS_SET, this.handleStoryWasSet);
  }

  componentWillUnmount() {
    const channel = addons.getChannel();
    channel.removeListener(Events.CURRENT_STORY_WAS_SET, this.handleStoryWasSet);
  }

  handleStoryWasSet = ({ storyId }: { storyId: string }) => {
    this.setState({
      storyId,
    });
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
    const { onDevice, storyStore } = this.props;
    const { storyId } = this.state;
    const story = storyStore.fromId(storyId);

    if (story && story.storyFn) {
      const { id, storyFn } = story;
      return (
        <View key={id} testID={id} style={{ flex: 1 }}>
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
