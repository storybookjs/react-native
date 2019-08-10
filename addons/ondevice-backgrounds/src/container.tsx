import React from 'react';
import { View } from 'react-native';
import { AddonStore } from '@storybook/addons';
import Constants from './constants';

interface ContainerProps {
  initialBackground: string;
  channel: ReturnType<AddonStore['getChannel']>;
}

interface ContainerState {
  background: string;
}

export default class Container extends React.Component<ContainerProps, ContainerState> {
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
