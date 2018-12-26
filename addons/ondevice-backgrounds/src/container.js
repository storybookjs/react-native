import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Events from './constants';

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = { background: props.initialBackground || '' };
    this.onBackgroundChange = this.onBackgroundChange.bind(this);
  }

  componentDidMount() {
    const { channel } = this.props;
    // Listen to the notes and render it.
    channel.on(Events.UPDATE_BACKGROUND, this.onBackgroundChange);
  }

  // This is some cleanup tasks when the Notes panel is unmounting.
  componentWillUnmount() {
    const { channel } = this.props;
    channel.removeListener(Events.UPDATE_BACKGROUND, this.onBackgroundChange);
  }

  onBackgroundChange(background) {
    this.setState({ background });
  }

  render() {
    const { background } = this.state;
    const { children } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: background || 'transparent' }}>{children}</View>
    );
  }
}

Container.propTypes = {
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }),
  initialBackground: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Container.defaultProps = {
  channel: undefined,
  initialBackground: '',
};
