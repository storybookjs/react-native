import React, { Component } from 'react';
import { View } from 'react-native';
import Constants from './constants';
import { Channel } from './BackgroundPanel';

interface ContainerProps {
  initialBackground: string;
  channel: Channel;
}

interface ContainerState {
  background: string;
}

export default class Container extends Component<ContainerProps, ContainerState> {
  constructor(props: ContainerProps) {
    super(props);
    this.state = { background: props.initialBackground || '' };
  }

  componentDidMount() {
    const { channel } = this.props;
    channel.on(Constants.UPDATE_BACKGROUND, this.onBackgroundChange);
  }

  componentWillUnmount() {
    const { channel } = this.props;
    channel.removeListener(Constants.UPDATE_BACKGROUND, this.onBackgroundChange);
  }

  onBackgroundChange = (background: string) => {
    this.setState({ background });
  };

  render() {
    const { background } = this.state;
    const { children } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: background || 'transparent' }}>{children}</View>
    );
  }
}
