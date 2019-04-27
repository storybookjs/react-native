import React, { Component } from 'react';
import { View, Text } from 'react-native';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import style from './style';

interface Props {
  listenToEvents: boolean;
  selection?: any;
  storyFn?: any;
  url: string;
}

interface State {
  storyFn?: any;
  selection?: any;
}

export default class StoryView extends Component<Props, State> {
  componentDidMount() {
    if (this.props.listenToEvents) {
      const channel = addons.getChannel();
      channel.on(Events.SELECT_STORY, this.selectStory);
      channel.on(Events.FORCE_RE_RENDER, this.forceReRender);
    }
  }

  componentWillUnmount() {
    const { listenToEvents } = this.props;

    if (listenToEvents) {
      const channel = addons.getChannel();
      channel.removeListener(Events.SELECT_STORY, this.selectStory);
      channel.removeListener(Events.FORCE_RE_RENDER, this.forceReRender);
    }
  }

  forceReRender = () => {
    this.forceUpdate();
  };

  selectStory = (selection: any) => {
    this.setState({ storyFn: selection.storyFn, selection });
  };

  renderHelp = () => {
    const { url } = this.props;
    return (
      <View style={style.help}>
        {url && url.length ? (
          <Text>
            Please open the Storybook UI ({url}) with a web browser and select a story for preview.
          </Text>
        ) : (
          <Text>
            Please open the Storybook UI with a web browser and select a story for preview.
          </Text>
        )}
      </View>
    );
  };

  renderOnDeviceUIHelp = () => (
    <View style={style.help}>
      <Text>Please open navigator and select a story to preview.</Text>
    </View>
  );

  render() {
    const { listenToEvents } = this.props;

    if (listenToEvents) {
      return this.renderListening();
    } else {
      return this.renderOnDevice();
    }
  }

  renderListening = () => {
    if (!this.state) {
      return null;
    }
    const { storyFn, selection } = this.state;
    const { kind, story } = selection;

    return storyFn ? (
      <View key={`${kind}:::${story}`} style={style.main}>
        {storyFn()}
      </View>
    ) : (
      this.renderHelp()
    );
  };

  renderOnDevice = () => {
    const { storyFn, selection } = this.props;
    const { kind, story } = selection;

    return storyFn ? (
      <View key={`${kind}:::${story}`} style={style.main}>
        {storyFn()}
      </View>
    ) : (
      this.renderOnDeviceUIHelp()
    );
  };
}
